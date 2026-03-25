import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase Service Role environment variables');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function confirmUser(username: string) {
  const email = `${username.toLowerCase().trim()}@fingenius.ai`;
  console.log(`Searching for user with email: ${email}`);
  
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  
  if (listError) {
    console.error('Error listing users:', listError);
    return;
  }
  
  const user = users.find(u => u.email === email);
  
  if (!user) {
    console.error(`User not found: ${email}`);
    return;
  }
  
  console.log(`Found user: ${user.id}. Confirming email...`);
  
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    user.id,
    { email_confirm: true }
  );
  
  if (updateError) {
    console.error('Error confirming user:', updateError);
  } else {
    console.log('User confirmed successfully!');
  }
}

confirmUser('Anurag00');
