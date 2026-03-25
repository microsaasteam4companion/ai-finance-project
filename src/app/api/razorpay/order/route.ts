import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: "Razorpay keys missing in environment." }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const options = {
      amount: (amount * 100).toString(), // Razorpay expects paise, so ₹199 = 19900
      currency: "INR",
      receipt: "rcpt_" + Math.random().toString(36).substring(7),
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
    
  } catch (error: any) {
    console.error('Razorpay Order Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
