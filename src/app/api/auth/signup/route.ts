import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const internalEmail = `${username.toLowerCase().trim()}@fingenius.ai`;

    // Create user with admin API to bypass email confirmation
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: internalEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        username: username.toLowerCase().trim(),
        full_name: username
      }
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: data.user });
  } catch (err: any) {
    console.error('Signup Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
