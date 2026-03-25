import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Bill } from "@/models/Bill";
import { Medicine } from "@/models/Medicine";
import { verifyJwt } from "@/lib/jwt";
import { cookies } from "next/headers";

async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  const decoded: any = verifyJwt(token);
  return decoded.id;
}

// ✅ CREATE BILL
export async function POST(req: Request) {
  await connectDB();

  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items } = await req.json();

  let total = 0;

  for (let item of items) {
    const med = await Medicine.findOne({
      name: item.name,
      ownerId: userId,
    });

    if (!med || med.stock < item.quantity) {
      return NextResponse.json(
        { error: `Not enough stock for ${item.name}` },
        { status: 400 }
      );
    }

    // reduce stock
    med.stock -= item.quantity;
    await med.save();

    total += item.price * item.quantity;
  }

  const bill = await Bill.create({
    items,
    total,
    ownerId: userId,
  });

  return NextResponse.json(bill);
}