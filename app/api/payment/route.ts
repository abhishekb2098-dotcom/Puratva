// TODO: Uncomment when Razorpay credentials are available

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { auth } from "@/lib/auth";
// import { createRazorpayOrder } from "@/lib/razorpay";
// import { generateOrderNumber } from "@/lib/utils";

// export async function POST(req: NextRequest) {
//   const session = await auth();
//   if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

//   try {
//     const { amount, items, address } = await req.json();

//     const razorpayOrder = await createRazorpayOrder(amount);

//     let savedAddress = null;
//     if (address) {
//       savedAddress = await prisma.address.create({
//         data: { ...address, userId: session.user.id },
//       });
//     }

//     const order = await prisma.order.create({
//       data: {
//         orderNumber: generateOrderNumber(),
//         userId: session.user.id,
//         addressId: savedAddress?.id,
//         status: "PENDING",
//         paymentStatus: "PENDING",
//         razorpayOrderId: razorpayOrder.id,
//         subtotal: amount,
//         total: amount,
//         items: {
//           create: items.map((item: any) => ({
//             productId: item.productId,
//             variantId: item.variantId || null,
//             name: item.name,
//             image: item.image,
//             price: item.price,
//             quantity: item.quantity,
//             total: item.price * item.quantity,
//           })),
//         },
//       },
//     });

//     return NextResponse.json({ success: true, razorpayOrder, orderId: order.id });
//   } catch (error: any) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

export async function POST() {
  return Response.json({ success: false, error: "Payment gateway not configured yet" }, { status: 503 });
}
