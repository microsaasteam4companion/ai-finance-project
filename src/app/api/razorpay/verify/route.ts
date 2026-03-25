import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = await req.json();

    if (!process.env.RAZORPAY_KEY_SECRET) {
       return NextResponse.json({ error: 'Missing backend secret' }, { status: 500 });
    }

    // Cryptographic validation according to Razorpay docs
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      if (userId) {
        const { error } = await supabaseServer
          .from('profiles')
          .update({ tier: 'premium' })
          .eq('id', userId);
        
        if (error) {
          console.error('Error updating profile tier:', error);
          return NextResponse.json({ success: true, message: "Payment verified, but DB update failed.", warning: "db_update_failed" });
        }
      }
      return NextResponse.json({ success: true, message: "Payment verified authentically and tier updated." });
    } else {
      return NextResponse.json({ error: "Invalid cryptographic signature. Potential fraud." }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
