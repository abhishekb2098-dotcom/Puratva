import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        subCategories: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();

    if (body.slug) {
      const existing = await prisma.category.findUnique({ where: { slug: body.slug } });
      if (existing) {
        return NextResponse.json(
          { success: false, error: `A category with slug "${body.slug}" already exists. Please use a different name or slug.` },
          { status: 409 }
        );
      }
    }

    const category = await prisma.category.create({ data: body });
    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    if (error.message?.includes("UNIQUE constraint failed")) {
      return NextResponse.json(
        { success: false, error: "A category with this name or slug already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
