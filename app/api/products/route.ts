import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "featured";
  const featured = searchParams.get("featured");
  const bestSeller = searchParams.get("bestSeller");

  const where: any = { isActive: true };
  if (category) where.category = { slug: category };
  if (search) where.name = { contains: search };
  if (featured === "true") where.isFeatured = true;
  if (bestSeller === "true") where.isBestSeller = true;

  const orderBy: any =
    sort === "price-asc"  ? { price: "asc" }
    : sort === "price-desc" ? { price: "desc" }
    : sort === "newest"     ? { createdAt: "desc" }
    : { sortOrder: "asc" };

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
          reviews: { select: { rating: true } },
          variants: true,
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);
    return NextResponse.json({ success: true, data: products, total, page, limit });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Resolve effective stock across product + all variants
function resolveStatus(stock: number, variants: any[], requestedStatus: string): string {
  if (requestedStatus === "coming_soon") return "coming_soon";
  const variantStock = variants?.length
    ? variants.reduce((s: number, v: any) => s + (parseInt(v.stock) || 0), 0)
    : null;
  const effectiveStock = variantStock !== null ? variantStock : stock;
  if (effectiveStock <= 0) return "out_of_stock";
  if (requestedStatus === "out_of_stock") return "active"; // auto-restore when re-stocked
  return requestedStatus || "active";
}

function sanitizeProductData(data: any) {
  return {
    ...data,
    subCategoryId: data.subCategoryId  || null,
    comparePrice:  data.comparePrice   || null,
    costPrice:     data.costPrice      || null,
    weight:        data.weight         || null,
    sku:           data.sku            || null,
  };
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { images, variants, tags, ...raw } = body;
    const productData = sanitizeProductData(raw);

    const computedStatus = resolveStatus(
      Number(productData.stock) || 0,
      variants,
      productData.status || "active"
    );

    const product = await prisma.product.create({
      data: {
        ...productData,
        status: computedStatus,
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

    if (computedStatus === "out_of_stock") {
      await prisma.notification.create({
        data: {
          type: "out_of_stock",
          title: "Product Out of Stock",
          message: `"${product.name}" was added with 0 stock and is marked out of stock.`,
          data: JSON.stringify({ productId: product.id, slug: product.slug }),
        },
      });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
