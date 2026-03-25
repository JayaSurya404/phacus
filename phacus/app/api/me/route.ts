import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import { User } from "@/models/User";
import { connectDB } from "@/lib/db";

export async function GET() {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded: any = verifyJwt(token);

  const user = await User.findById(decoded.id);

  return NextResponse.json({ name: user.name });
}