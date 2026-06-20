// TODO: Uncomment when Razorpay credentials are available

// import Razorpay from "razorpay";

// export const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID!,
//   key_secret: process.env.RAZORPAY_KEY_SECRET!,
// });

// export async function createRazorpayOrder(amount: number, currency = "INR") {
//   const order = await razorpay.orders.create({
//     amount: Math.round(amount * 100),
//     currency,
//     receipt: `receipt_${Date.now()}`,
//   });
//   return order;
// }
