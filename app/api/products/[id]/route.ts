import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        subCategory: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        reviews: { include: { user: { select: { name: true, image: true } } } },
        tags: true,
      },
    });
    if (!product) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await req.json();
    const { images, variants, tags, id: _id, categoryId, subCategoryId, category, subCategory, reviews, ...data } = body;

    await prisma.$transaction([
      prisma.productImage.deleteMany({ where: { productId: id } }),
      prisma.productVariant.deleteMany({ where: { productId: id } }),
      prisma.productTag.deleteMany({ where: { productId: id } }),
    ]);

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        categoryId,
        subCategoryId: subCategoryId || null,
        images: images?.length
          ? { create: images.map((img: any, i: number) => ({ url: img.url, isPrimary: img.isPrimary || i === 0, sortOrder: i })) }
          : undefined,
        variants: variants?.length
          ? { create: variants.map((v: any) => ({ name: v.name, value: v.value, price: parseFloat(v.price) || null, stock: parseInt(v.stock) || 0 })) }
          : undefined,
        tags: tags?.length
          ? { create: tags.map((t: string) => ({ tag: t })) }
          : undefined,
      },
    });
    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await prisma.product.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
