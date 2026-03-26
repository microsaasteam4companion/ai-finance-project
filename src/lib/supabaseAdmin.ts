import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// During build, these variables might be missing. We only warn instead of throwing
// to allow the build to complete. They must be provided in Vercel settings for runtime.
if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Missing Supabase Service Role environment variables (expected during build if not provided).');
}

export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
