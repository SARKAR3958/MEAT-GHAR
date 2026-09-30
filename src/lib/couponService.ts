import { supabase } from './supabase';

export interface RealCoupon {
  id: string;
  code: string;
  discountTag: string;
  title: string;
  description: string;
  minOrder: number;
  discountAmount: number;
  discountPercentage?: number;
  maxDiscount?: number;
  validTill: string;
  appliesTo: string;
  isActive: boolean;
  isExpired: boolean;
  highlightText?: string;
}

// Default system coupons in case Supabase table is being initialized
const INITIAL_SYSTEM_COUPONS: RealCoupon[] = [
  {
    id: 'c_halal100',
    code: 'MEAT100',
    discountTag: '₹100 OFF',
    title: 'Flat ₹100 OFF on Fresh Meat',
    description: 'Get ₹100 instant discount on all orders above ₹499.',
    minOrder: 499,
    discountAmount: 100,
    validTill: '31 Dec 2026',
    appliesTo: 'All Chicken & Mutton Items',
    isActive: true,
    isExpired: false,
    highlightText: '🔥 Popular Choice',
  },
  {
    id: 'c_first50',
    code: 'FRESH50',
    discountTag: '₹50 OFF',
    title: 'Flat ₹50 OFF Welcome Offer',
    description: 'Instant ₹50 savings on minimum cart value of ₹299.',
    minOrder: 299,
    discountAmount: 50,
    validTill: '31 Dec 2026',
    appliesTo: 'All Orders',
    isActive: true,
    isExpired: false,
    highlightText: '🎉 Welcome Offer',
  },
];

export async function fetchRealCoupons(): Promise<RealCoupon[]> {
  try {
    // 1. Check Supabase coupons table
    const { data: dbCoupons, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('is_active', true);

    if (!error && dbCoupons && dbCoupons.length > 0) {
      return dbCoupons.map((c: any) => ({
        id: String(c.id),
        code: String(c.code || '').toUpperCase().trim(),
        discountTag: c.discount_tag || `${c.discount_amount ? `₹${c.discount_amount} OFF` : `${c.discount_percent || 10}% OFF`}`,
        title: c.title || `Save with ${c.code}`,
        description: c.description || 'Valid on fresh meat items.',
        minOrder: Number(c.min_order_amount || c.min_order || 0),
        discountAmount: Number(c.discount_amount || 50),
        discountPercentage: c.discount_percent ? Number(c.discount_percent) : undefined,
        maxDiscount: c.max_discount ? Number(c.max_discount) : undefined,
        validTill: c.valid_till || c.expiry_date || '31 Dec 2026',
        appliesTo: c.applies_to || 'All Categories',
        isActive: Boolean(c.is_active ?? true),
        isExpired: Boolean(c.is_expired ?? false),
        highlightText: c.highlight_text,
      }));
    }

    // 2. Also check if admin offers table exists
    const { data: dbOffers } = await supabase
      .from('offers')
      .select('*')
      .eq('is_active', true);

    if (dbOffers && dbOffers.length > 0) {
      return dbOffers.map((o: any) => ({
        id: String(o.id),
        code: String(o.code || o.title || '').replace(/\s+/g, '').toUpperCase().slice(0, 10),
        discountTag: o.discount_value || 'Special Offer',
        title: o.title || 'Special Promotion',
        description: o.description || 'Promotional offer valid for limited time.',
        minOrder: Number(o.min_order || 299),
        discountAmount: Number(o.discount_amount || 50),
        validTill: o.valid_till || '31 Dec 2026',
        appliesTo: 'All Orders',
        isActive: Boolean(o.is_active ?? true),
        isExpired: false,
      }));
    }
  } catch (err) {
    console.warn('Real coupon fetch notice:', err);
  }

  // Fallback to active system coupons
  return INITIAL_SYSTEM_COUPONS;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: RealCoupon;
  discountAmount: number;
  message: string;
}

export async function validateRealCoupon(
  code: string,
  cartSubtotal: number
): Promise<CouponValidationResult> {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, discountAmount: 0, message: 'Please enter a coupon code.' };
  }

  const allCoupons = await fetchRealCoupons();
  const matched = allCoupons.find((c) => c.code === cleanCode && c.isActive && !c.isExpired);

  if (!matched) {
    return {
      valid: false,
      discountAmount: 0,
      message: `Invalid coupon code "${cleanCode}". Please enter a valid active coupon.`,
    };
  }

  if (cartSubtotal < matched.minOrder) {
    return {
      valid: false,
      discountAmount: 0,
      message: `Minimum cart value of ₹${matched.minOrder} required for coupon ${matched.code}. (Current: ₹${cartSubtotal})`,
    };
  }

  let finalDiscount = matched.discountAmount;
  if (matched.discountPercentage) {
    const calculated = (cartSubtotal * matched.discountPercentage) / 100;
    finalDiscount = matched.maxDiscount ? Math.min(calculated, matched.maxDiscount) : calculated;
  }

  return {
    valid: true,
    coupon: matched,
    discountAmount: Math.round(finalDiscount),
    message: `Coupon ${matched.code} applied! You saved ₹${Math.round(finalDiscount)}.`,
  };
}
