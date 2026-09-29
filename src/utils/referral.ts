/**
 * Generates a unique referral code per user based on their name and phone number.
 */
export function getUserReferralCode(userName?: string, userPhone?: string): string {
  const cleanPhone = (userPhone || '').replace(/\D/g, '');
  const keyIdentifier = cleanPhone || (userName ? userName.trim().toLowerCase().replace(/\s+/g, '_') : 'guest');
  const storageKey = `meatghar_referral_${keyIdentifier}`;

  try {
    const existing = localStorage.getItem(storageKey);
    if (existing) {
      return existing;
    }
  } catch {
    // localStorage error fallback
  }

  // Extract clean uppercase first name
  const rawName = (userName && userName.trim()) ? userName.trim() : 'MEATGHAR';
  const firstName = rawName
    .split(' ')[0]
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase();

  const namePrefix = firstName.length >= 3 ? firstName.slice(0, 6) : 'MEAT';

  // Last 4 digits of phone or deterministic/random digits
  let digits = '';
  if (cleanPhone.length >= 4) {
    digits = cleanPhone.slice(-4);
  } else {
    digits = Math.floor(1000 + Math.random() * 9000).toString();
  }

  const generatedCode = `${namePrefix}${digits}`;

  try {
    localStorage.setItem(storageKey, generatedCode);
  } catch {
    // ignore
  }

  return generatedCode;
}
