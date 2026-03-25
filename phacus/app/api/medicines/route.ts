import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Medicine } from "@/models/Medicine";
import { verifyJwt } from "@/lib/jwt";
import { cookies } from "next/headers";

// 🔐 Get user from token (SAFE)
async function getUserId() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const decoded: any = verifyJwt(token);
    return decoded.id;
  } catch (err) {
    return null; // prevent crash
  }
}

// =========================
// ✅ GET (fetch medicines)
// =========================
export async function GET() {
  await connectDB();

  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const meds = await Medicine.find({ ownerId: userId }).sort({ _id: -1 });

  return NextResponse.json(meds);
}

// =========================
// ✅ POST (add medicine)
// =========================
export async function POST(req: Request) {
  await connectDB();

  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, stock, price, expiryDate } = await req.json();

if (!name || !stock || !price || !expiryDate) {
  return NextResponse.json(
    { error: "All fields required" },
    { status: 400 }
  );
}

const med = await Medicine.create({
  name,
  stock: Number(stock),
  price: Number(price),
  expiryDate: new Date(expiryDate),
  ownerId: userId,
});

  return NextResponse.json(med, { status: 201 });
}

// =========================
// ✅ DELETE
// =========================
export async function DELETE(req: Request) {
  await connectDB();

  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "ID required" },
      { status: 400 }
    );
  }

  await Medicine.deleteOne({ _id: id, ownerId: userId });

  return NextResponse.json({ message: "Deleted" });
}

// =========================
// ✅ PUT (update stock)
// =========================
export async function PUT(req: Request) {
  await connectDB();

  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, change } = await req.json();

  if (!id || change === undefined) {
    return NextResponse.json(
      { error: "Invalid data" },
      { status: 400 }
    );
  }

  const med = await Medicine.findOne({
    _id: id,
    ownerId: userId,
  });

  if (!med) {
    return NextResponse.json(
      { error: "Medicine not found" },
      { status: 404 }
    );
  }

  // prevent negative stock
  med.stock = Math.max(0, med.stock + change);

  await med.save();

  return NextResponse.json(med);
}