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
    const { images, variants, tags, id: _id, categoryId, subCategoryId, category, subCategory, reviews, ...raw } = body;

    // Resolve effective status from stock
    const variantStock = variants?.length
      ? variants.reduce((s: number, v: any) => s + (parseInt(v.stock) || 0), 0)
      : null;
    const effectiveStock = variantStock !== null ? variantStock : (Number(raw.stock) || 0);
    let computedStatus = raw.status || "active";
    if (computedStatus !== "coming_soon" && computedStatus !== "out_of_stock") {
      if (effectiveStock <= 0) computedStatus = "out_of_stock";
    }

    const prevProduct = await prisma.product.findUnique({ where: { id }, select: { status: true, name: true } });

    const data = {
      ...raw,
      subCategoryId: subCategoryId || null,
      comparePrice:  raw.comparePrice  || null,
      costPrice:     raw.costPrice     || null,
      weight:        raw.weight        || null,
      sku:           raw.sku           || null,
      status:        computedStatus,
    };

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
        subCategoryId: data.subCategoryId,
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

    // Notify admin when product transitions to out_of_stock
    if (computedStatus === "out_of_stock" && prevProduct?.status !== "out_of_stock") {
      await prisma.notification.create({
        data: {
          type: "out_of_stock",
          title: "Product Out of Stock",
          message: `"${prevProduct?.name}" has run out of stock and needs restocking.`,
          data: JSON.stringify({ productId: product.id, slug: product.slug }),
        },
      });
    }

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
