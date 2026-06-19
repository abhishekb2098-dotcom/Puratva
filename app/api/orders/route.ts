import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const isAdmin = session.user?.role === "ADMIN";
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const limit = 20;

  const where: any = isAdmin ? {} : { userId: session.user.id };
  const status = req.nextUrl.searchParams.get("status");
  if (status) where.status = status;

  try {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: { select: { name: true, images: { take: 1 } } } } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);
    return NextResponse.json({ success: true, data: orders, total });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
