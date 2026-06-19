import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { code, orderAmount } = await req.json();
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
        AND: [
          { OR: [{ usageLimit: null }] },
        ],
      },
    });

    if (!coupon) {
      return NextResponse.json({ success: false, error: "Invalid or expired coupon" }, { status: 400 });
    }

    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      return NextResponse.json({
        success: false,
        error: `Minimum order amount ₹${coupon.minOrderAmount} required`,
      }, { status: 400 });
    }

    let discount = 0;
    if (coupon.type === "PERCENTAGE") {
      discount = Math.round((orderAmount * coupon.value) / 100);
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = Math.min(coupon.value, orderAmount);
    }

    return NextResponse.json({ success: true, discount, coupon });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, data: coupons });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
