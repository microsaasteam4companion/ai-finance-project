import { adminAuth, adminDb } from './firebaseAdmin';
import { isEmailPremium } from './premiumConfig';

/**
 * Verifies if a user has premium access.
 * Checks both the database tier and the hardcoded whitelist.
 */
export async function verifyPremiumStatus(userId: string) {
  try {
    // 1. Get user profile from Firestore
    const profileDoc = await adminDb.collection('users').doc(userId).get();
    
    if (!profileDoc.exists) return false;
    const profile = profileDoc.data();

    // 2. Check if user is in hardcoded whitelist (via Auth email)
    const user = await adminAuth.getUser(userId);
    
    if (user && user.email && isEmailPremium(user.email)) {
      return true;
    }

    // 3. Check database tier
    return profile?.tier === 'premium';
  } catch (err) {
    console.error('Error verifying premium status:', err);
    return false;
  }
}
