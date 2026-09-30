import { supabase } from './supabase';
import { getCurrentUserIdentifier } from './addressService';
import { getUserReferralCode } from '../utils/referral';

export interface ReferredUser {
  id: string;
  name: string;
  phone: string;
  date: string;
  rewardEarned: string;
  status: 'Registered' | 'First Order Done' | 'Reward Claimed';
}

export interface ReferralProgressData {
  referralCode: string;
  referralCount: number;
  targetCount: number;
  progressPercent: number;
  totalEarnedAmount: number;
  referredFriends: ReferredUser[];
  canClaimReward: boolean;
}

/**
 * Fetch real referral stats from Supabase
 */
export async function fetchUserReferralData(): Promise<ReferralProgressData> {
  const ident = getCurrentUserIdentifier();
  const userName = ident.name || 'User';
  const userPhone = ident.phone?.replace(/\D/g, '').slice(-10) || '9876543210';
  const referralCode = getUserReferralCode(userName, userPhone);

  const targetCount = 10;
  const referredFriends: ReferredUser[] = [];

  try {
    // 1. Check `referrals` table if exists
    const { data: refRows, error: refErr } = await supabase
      .from('referrals')
      .select('*')
      .or(`referrer_phone.eq.${userPhone},referrer_code.eq.${referralCode}`)
      .order('created_at', { ascending: false });

    if (!refErr && Array.isArray(refRows) && refRows.length > 0) {
      refRows.forEach((r: any) => {
        const d = r.created_at ? new Date(r.created_at) : new Date();
        referredFriends.push({
          id: r.id,
          name: r.referee_name || r.user_name || 'Friend',
          phone: r.referee_phone || r.user_phone || '',
          date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          rewardEarned: '250g Free Meat',
          status: r.status || 'Registered',
        });
      });
    }

    // 2. Also check `profiles` table where referred_by matches this user's phone or code
    if (referredFriends.length === 0) {
      const { data: profRows, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .or(`referred_by.eq.${referralCode},referred_by.eq.${userPhone}`)
        .order('created_at', { ascending: false });

      if (!profErr && Array.isArray(profRows) && profRows.length > 0) {
        profRows.forEach((p: any) => {
          const d = p.created_at ? new Date(p.created_at) : new Date();
          const maskedPhone = p.phone ? `${p.phone.slice(0, 3)}****${p.phone.slice(-3)}` : '';
          referredFriends.push({
            id: p.id || p.phone,
            name: p.full_name || 'Friend',
            phone: maskedPhone || p.phone || '',
            date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            rewardEarned: '250g Free Meat',
            status: 'Registered',
          });
        });
      }
    }
  } catch (err) {
    console.warn('Real referral fetch notice:', err);
  }

  const count = referredFriends.length;
  const progressPercent = Math.min(100, (count / targetCount) * 100);

  return {
    referralCode,
    referralCount: count,
    targetCount,
    progressPercent,
    totalEarnedAmount: count * 50,
    referredFriends,
    canClaimReward: count >= targetCount,
  };
}
