import { supabase } from './supabase';

export interface StoreSettings {
  deliveryFee: number;
  freeDeliveryThreshold?: number;
  minOrderAmount?: number;
  isStoreOpen?: boolean;
}

const DEFAULT_SETTINGS: StoreSettings = {
  deliveryFee: 40,
  freeDeliveryThreshold: undefined, // No automatic free delivery unless set in Supabase
  minOrderAmount: 99,
  isStoreOpen: true,
};

const SETTINGS_CACHE_KEY = 'meatghar_store_settings_v1';

export async function fetchStoreSettings(): Promise<StoreSettings> {
  // 1. Check local cache first
  let cached: StoreSettings = DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_CACHE_KEY);
    if (raw) {
      cached = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {
    // ignore
  }

  try {
    // 2. Query Supabase settings table (check multiple possible schema keys)
    const { data, error } = await supabase
      .from('settings')
      .select('*');

    if (!error && data && data.length > 0) {
      let fee = cached.deliveryFee;
      let threshold = cached.freeDeliveryThreshold;

      data.forEach((row: any) => {
        if (row.key === 'delivery_fee' || row.name === 'delivery_fee') {
          const parsed = Number(row.value);
          if (!isNaN(parsed)) fee = parsed;
        }
        if (row.key === 'free_delivery_threshold' || row.name === 'free_delivery_threshold') {
          const parsed = Number(row.value);
          if (!isNaN(parsed)) threshold = parsed;
        }
        // If settings is a single object row with columns
        if (row.delivery_fee !== undefined) {
          const parsed = Number(row.delivery_fee);
          if (!isNaN(parsed)) fee = parsed;
        }
      });

      const updated: StoreSettings = {
        ...cached,
        deliveryFee: fee,
        freeDeliveryThreshold: threshold,
      };

      try {
        localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }

      return updated;
    }

    // 3. Also check store_settings table
    const { data: storeData } = await supabase
      .from('store_settings')
      .select('*')
      .limit(1)
      .single();

    if (storeData) {
      const fee = Number(storeData.delivery_fee ?? storeData.delivery_charge ?? 40);
      const updated: StoreSettings = {
        ...cached,
        deliveryFee: !isNaN(fee) ? fee : 40,
        freeDeliveryThreshold: storeData.free_delivery_threshold ? Number(storeData.free_delivery_threshold) : undefined,
      };
      localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(updated));
      return updated;
    }
  } catch (err) {
    console.warn('Notice: Error fetching settings from Supabase:', err);
  }

  return cached;
}
