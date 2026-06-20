import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, slug, categoryId, description, image, isActive, sortOrder } = body;

    if (!name || !slug || !categoryId) {
      return NextResponse.json({ success: false, error: "name, slug, and categoryId are required" }, { status: 400 });
    }

    const subCategory = await prisma.subCategory.create({
      data: { name, slug, categoryId, description: description || null, image: image || null, isActive: isActive ?? true, sortOrder: sortOrder ?? 0 },
    });

    return NextResponse.json({ success: true, data: subCategory });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
