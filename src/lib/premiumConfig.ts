/**
 * Premium Whitelist Configuration
 * 
 * Add email addresses here that should have permanent premium access
 * regardless of their payment status in the database.
 */
export const PREMIUM_EMAILS = [
  'anuragkumarprajapatii59@gmail.com',
  'anuragkumarprajapatii09@gmail.com',
  // Add more premium emails here
];

export const isEmailPremium = (email: string | undefined | null) => {
  if (!email) return false;
  return PREMIUM_EMAILS.includes(email.toLowerCase());
};
