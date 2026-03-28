import { adminDb } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const signature = req.headers.get('x-dodo-signature');

    // In a production app, verify the signature
    console.log('Dodo Webhook received:', payload);

    const eventType = payload.type;
    const userId = payload.data?.metadata?.user_id || payload.metadata?.user_id;
    const customerEmail = payload.data?.customer?.email || payload.customer?.email;

    if (eventType === 'payment.succeeded' || eventType === 'subscription.active') {
       let targetUserId = userId;
       
       // Fallback to email lookup if userId is missing
       if (!targetUserId && customerEmail) {
          const snapshot = await adminDb.collection('users').where('email', '==', customerEmail).limit(1).get();
          if (!snapshot.empty) targetUserId = snapshot.docs[0].id;
       }

       if (targetUserId) {
          try {
            await adminDb.collection('users').doc(targetUserId).update({
              tier: 'premium'
            });
            return NextResponse.json({ success: true, message: 'Tier updated to premium' });
          } catch (error) {
            console.error('Error updating user tier via Dodo webhook:', error);
            return NextResponse.json({ error: 'Firestore update failed' }, { status: 500 });
          }
       }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
