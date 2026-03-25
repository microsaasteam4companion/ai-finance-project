import { supabaseServer } from './supabaseServer';
import { isEmailPremium } from './premiumConfig';

/**
 * Verifies if a user has premium access.
 * Checks both the database tier and the hardcoded whitelist.
 */
export async function verifyPremiumStatus(userId: string) {
  try {
    // 1. Get user email and tier from database
    const { data: profile, error } = await supabaseServer
      .from('profiles')
      .select('tier, id')
      .eq('id', userId)
      .single();

    if (error || !profile) return false;

    // 2. Check if user is in hardcoded whitelist
    // We need the email from auth.users which is linked to profile.id
    const { data: { user }, error: authError } = await supabaseServer.auth.admin.getUserById(userId);
    
    if (!authError && user && isEmailPremium(user.email)) {
      return true;
    }

    // 3. Check database tier
    return profile.tier === 'premium';
  } catch (err) {
    console.error('Error verifying premium status:', err);
    return false;
  }
}
