import DodoPayments from 'dodopayments';
import { NextResponse } from 'next/server';

// Client initialization moved inside the handler for runtime resilience

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json();

    if (!userId || !email) {
      return NextResponse.json({ error: 'Missing userId or email' }, { status: 400 });
    }

    const apiKey = process.env.DODO_PAYMENTS_API_KEY;
    if (!apiKey) {
      console.error('Dodo API Key is missing in environment variables');
      return NextResponse.json({ error: 'Config Error: API Key missing' }, { status: 500 });
    }

    const client = new DodoPayments({
      bearerToken: apiKey,
      environment: 'live_mode',
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const session = await client.checkoutSessions.create({
      product_cart: [{ product_id: 'pdt_0NbF8px9IxHF0VqdTLEfH', quantity: 1 }],
      customer: { email },
      metadata: { user_id: userId },
      return_url: `${appUrl}/dashboard/billing?status=succeeded`,
    });

    return NextResponse.json({ checkout_url: session.checkout_url });
  } catch (error: any) {
    console.error('Dodo Checkout Session Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
