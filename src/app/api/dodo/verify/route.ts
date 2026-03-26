import DodoPayments from 'dodopayments';
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

const client = new DodoPayments({
  bearerToken: process.env['DODO_PAYMENTS_API_KEY'],
  environment: 'test_mode',
});

export async function POST(req: Request) {
  try {
    const { paymentId, userId } = await req.json();

    if (!paymentId) {
      return NextResponse.json({ error: 'Missing paymentId' }, { status: 400 });
    }

    // Retrieve payment status directly from Dodo
    const payment = await client.payments.retrieve(paymentId);

    if (payment.status === 'succeeded') {
       // Update user tier in Supabase
       const targetUserId = userId || payment.metadata?.user_id;
       
       if (targetUserId) {
          const { error } = await supabaseServer
            .from('profiles')
            .update({ tier: 'premium' })
            .eq('id', targetUserId);
          
          if (error) {
             console.error('Error updating user tier via direct verification:', error);
             return NextResponse.json({ error: 'DB update failed' }, { status: 500 });
          }
          
          return NextResponse.json({ success: true, tier: 'premium' });
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
