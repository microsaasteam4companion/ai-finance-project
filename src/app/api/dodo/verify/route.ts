import DodoPayments from 'dodopayments';
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

// Client initialization moved inside the handler for runtime resilience

export async function POST(req: Request) {
  try {
    const { paymentId, userId } = await req.json();

    const apiKey = process.env.DODO_PAYMENTS_API_KEY;
    if (!apiKey) {
      console.error('Dodo API Key is missing in environment variables');
      return NextResponse.json({ error: 'Config Error: API Key missing' }, { status: 500 });
    }

    const client = new DodoPayments({
      bearerToken: apiKey,
      environment: 'test_mode',
    });

    // Retrieve payment status directly from Dodo
    const payment = await client.payments.retrieve(paymentId);

    if (payment.status === 'succeeded') {
       // Update user tier in Firestore
       const targetUserId = userId || (payment.metadata as any)?.user_id;
       
       if (targetUserId) {
          try {
            await adminDb.collection('users').doc(targetUserId).update({
              tier: 'premium'
            });
            return NextResponse.json({ success: true, tier: 'premium' });
          } catch (error) {
            console.error('Error updating user tier via direct verification in Firestore:', error);
            return NextResponse.json({ error: 'Firestore update failed' }, { status: 500 });
          }
       } else {
          return NextResponse.json({ error: 'User ID not found in payment metadata' }, { status: 400 });
       }
    }

    return NextResponse.json({ success: false, status: payment.status });
  } catch (error: any) {
    console.error('Dodo Verification Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
