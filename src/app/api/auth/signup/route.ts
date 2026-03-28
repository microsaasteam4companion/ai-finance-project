import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const sanitizedUsername = username.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    const internalEmail = `${sanitizedUsername}@fingenius.ai`;

    // Create user with Firebase Admin Auth
    if (!process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      return NextResponse.json({ 
        error: 'Server configuration error: Firebase Admin credentials missing. Please check .env.local' 
      }, { status: 500 });
    }

    const user = await adminAuth.createUser({
      email: internalEmail,
      password: password,
      displayName: username,
      emailVerified: true,
    });

    // Create a default profile in Firestore
    await adminDb.collection('users').doc(user.uid).set({
      id: user.uid,
      username: username.toLowerCase().trim(),
      full_name: username,
      email: internalEmail,
      tier: 'free',
      assets: 0,
      debt: 0,
      emergency_fund: 0,
      risk_profile: 'moderate',
      household_id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    });

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    console.error('SIGNUP API ERROR DETAILS:', {
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
