import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });

    await prisma.newsletter.create({ data: { email } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ success: false, error: "Already subscribed" }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
