import DodoPayments from 'dodopayments';
import { NextResponse } from 'next/server';

const client = new DodoPayments({
  bearerToken: process.env['DODO_PAYMENTS_API_KEY'],
  environment: 'test_mode', // change to 'live_mode' for production
});

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json();

    if (!userId || !email) {
      return NextResponse.json({ error: 'Missing userId or email' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const returnBaseUrl = process.env.NEXT_PUBLIC_APP_URL || origin;

    const session = await client.checkoutSessions.create({
      product_cart: [{ product_id: 'pdt_0NbH8qheEqFDGTInPAlTP', quantity: 1 }],
      customer: { email },
      metadata: { user_id: userId },
      return_url: `${returnBaseUrl}/dashboard/billing`,
    });

    return NextResponse.json({ checkout_url: session.checkout_url });
  } catch (error: any) {
    console.error('Dodo Checkout Session Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
