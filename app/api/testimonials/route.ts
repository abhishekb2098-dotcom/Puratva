import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  const featured = req.nextUrl.searchParams.get("featured");

  const where: any = {};
  if (status) where.status = status;
  else where.status = "APPROVED";
  if (featured === "true") where.isFeatured = true;

  try {
    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await auth();
    const testimonial = await prisma.testimonial.create({
      data: {
        ...body,
        userId: session?.user?.id || null,
        status: "PENDING",
      },
    });
    return NextResponse.json({ success: true, data: testimonial });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
