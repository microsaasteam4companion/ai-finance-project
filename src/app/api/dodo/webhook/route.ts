import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const signature = req.headers.get('x-dodo-signature'); // Verify if Dodo uses this header

    // In a production app, you MUST verify the signature here
    // For now, we trust the payload but log it
    console.log('Dodo Webhook received:', payload);

    const eventType = payload.type;
    const userId = payload.data?.metadata?.user_id || payload.metadata?.user_id;
    const customerEmail = payload.data?.customer?.email || payload.customer?.email;

    if (eventType === 'payment.succeeded' || eventType === 'subscription.active') {
       let targetUserId = userId;
       
       // Fallback to email lookup if userId is missing
       if (!targetUserId && customerEmail) {
          const { data: profile } = await supabaseServer
            .from('profiles')
            .select('id')
            .eq('email', customerEmail)
            .single();
          if (profile) targetUserId = profile.id;
       }

       if (targetUserId) {
          const { error } = await supabaseServer
            .from('profiles')
            .update({ tier: 'premium' })
            .eq('id', targetUserId);
          
          if (error) {
             console.error('Error updating user tier via Dodo webhook:', error);
             return NextResponse.json({ error: 'DB update failed' }, { status: 500 });
          }
          
          return NextResponse.json({ success: true, message: 'Tier updated to premium' });
       }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
