import { supabase } from './supabase';
import { SavedAddress } from '../types/location';

export interface UserIdentifier {
  phone?: string;
  email?: string;
  uid?: string;
  name?: string;
}

export function getCurrentUserIdentifier(): UserIdentifier {
  const result: UserIdentifier = {};
  try {
    const raw = localStorage.getItem('meatghar_user');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.phone) result.phone = String(parsed.phone).trim();
      if (parsed.email) result.email = String(parsed.email).trim();
      if (parsed.userName) result.name = String(parsed.userName).trim();
    }
  } catch {
    // ignore
  }
  return result;
}

/**
 * Convert a database row from Supabase `addresses` to `SavedAddress` interface
 */
function rowToSavedAddress(row: any): SavedAddress {
  const street = row.street_road || '';
  const locality = row.locality || '';
  const houseFlat = row.house_flat || '';
  const city = row.city || 'Noida';
  const fullAddress = `${houseFlat}${houseFlat && street ? ', ' : ''}${street}${
    (houseFlat || street) && locality ? ', ' : ''
  }${locality}${city ? ', ' + city : ''}`;

  return {
    id: row.id,
    type: (row.type as 'Home' | 'Work' | 'Other') || 'Home',
    fullName: row.full_name || '',
    phone: row.phone || '',
    altPhone: row.alt_phone || '',
    houseFlat,
    street,
    locality,
    landmark: row.landmark || '',
    city,
    state: row.state || 'Uttar Pradesh',
    pincode: row.pincode || '201301',
    isDefault: Boolean(row.is_default),
    address: fullAddress,
  };
}

/**
 * Fetch all addresses from Supabase for the current user
 * Returns ONLY real addresses from Supabase, NO mock addresses.
 */
export async function fetchUserAddresses(identifier?: UserIdentifier): Promise<SavedAddress[]> {
  const current = identifier || getCurrentUserIdentifier();
  const searchValues = [current.phone, current.email, current.uid].filter(Boolean) as string[];

  const addressesMap = new Map<string, SavedAddress>();

  // 1. Fetch from Supabase addresses table
  try {
    let query = supabase.from('addresses').select('*').order('created_at', { ascending: false });

    if (searchValues.length > 0) {
      // Query where user_id is any of phone, email, or uid
      const orFilter = searchValues.map((val) => `user_id.eq.${val}`).join(',');
      query = query.or(orFilter);
    }

    const { data, error } = await query;
    if (!error && Array.isArray(data)) {
      data.forEach((row) => {
        addressesMap.set(row.id, rowToSavedAddress(row));
      });
    }
  } catch (err) {
    console.warn('Error fetching addresses from Supabase table:', err);
  }

  // 2. Also check Supabase Auth user record (auth.users metadata) to read addresses stored on user table
  try {
    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user?.user_metadata?.addresses && Array.isArray(authData.user.user_metadata.addresses)) {
      authData.user.user_metadata.addresses.forEach((addr: any) => {
        if (addr && addr.id && !addressesMap.has(addr.id)) {
          addressesMap.set(addr.id, addr);
        }
      });
    }
  } catch {
    // ignore
  }

  // 3. Fallback to local user cache only if offline or empty
  if (addressesMap.size === 0) {
    try {
      const localCached = localStorage.getItem('meatghar_user_addresses');
      if (localCached) {
        const parsed = JSON.parse(localCached);
        if (Array.isArray(parsed)) {
          parsed.forEach((addr) => {
            if (addr && addr.id) addressesMap.set(addr.id, addr);
          });
        }
      }
    } catch {
      // ignore
    }
  }

  const results = Array.from(addressesMap.values());
  // Save to local cache
  try {
    localStorage.setItem('meatghar_user_addresses', JSON.stringify(results));
  } catch {
    // ignore
  }

  return results;
}

/**
 * Save new address into Supabase
 * Stored in Supabase addresses table AND inside the user's auth record in Supabase
 */
export async function saveUserAddress(
  addressData: Omit<SavedAddress, 'id'> & { id?: string },
  identifier?: UserIdentifier
): Promise<SavedAddress> {
  const current = identifier || getCurrentUserIdentifier();
  const userId = current.phone || current.email || current.uid || 'current_user';
  const addressId = addressData.id || `addr_${Date.now()}`;

  const fullAddrStr =
    addressData.address ||
    `${addressData.houseFlat}, ${addressData.street}, ${addressData.locality}, ${addressData.city}${
      addressData.pincode ? ' - ' + addressData.pincode : ''
    }`;

  const savedObj: SavedAddress = {
    ...addressData,
    id: addressId,
    address: fullAddrStr,
    fullName: addressData.fullName || current.name || 'User',
    phone: addressData.phone || current.phone || '',
    isDefault: addressData.isDefault ?? false,
  };

  // If set to default, unmark other addresses first in Supabase
  if (savedObj.isDefault && searchFilter(current)) {
    try {
      const orFilter = [current.phone, current.email, current.uid]
        .filter(Boolean)
        .map((v) => `user_id.eq.${v}`)
        .join(',');
      if (orFilter) {
        await supabase.from('addresses').update({ is_default: false }).or(orFilter);
      }
    } catch {
      // ignore
    }
  }

  // 1. Insert or update in Supabase addresses table
  const dbPayload = {
    id: addressId,
    user_id: userId,
    type: savedObj.type || 'Home',
    full_name: savedObj.fullName,
    phone: savedObj.phone,
    alt_phone: savedObj.altPhone || '',
    house_flat: savedObj.houseFlat,
    street_road: savedObj.street,
    locality: savedObj.locality,
    landmark: savedObj.landmark || '',
    city: savedObj.city || 'Guwahati',
    is_default: Boolean(savedObj.isDefault),
  };

  try {
    const { error } = await supabase.from('addresses').upsert(dbPayload, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase addresses upsert notice:', error.message);
    }
  } catch (err) {
    console.warn('Error saving to Supabase addresses table:', err);
  }

  // 2. Also store directly in the user's table (Supabase Auth user metadata)
  try {
    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user) {
      const currentMetaAddrs = Array.isArray(authData.user.user_metadata?.addresses)
        ? [...authData.user.user_metadata.addresses]
        : [];
      const existingIdx = currentMetaAddrs.findIndex((a: any) => a.id === addressId);
      if (existingIdx >= 0) {
        currentMetaAddrs[existingIdx] = savedObj;
      } else {
        currentMetaAddrs.push(savedObj);
      }
      await supabase.auth.updateUser({
        data: {
          addresses: currentMetaAddrs,
        },
      });
    }
  } catch (err) {
    console.warn('Error saving address to user table metadata:', err);
  }

  // 3. Update local cache
  try {
    const currentList = await fetchUserAddresses(current);
    const updated = [savedObj, ...currentList.filter((a) => a.id !== addressId)];
    localStorage.setItem('meatghar_user_addresses', JSON.stringify(updated));
  } catch {
    // ignore
  }

  return savedObj;
}

/**
 * Delete address from Supabase
 */
export async function deleteUserAddress(addressId: string, identifier?: UserIdentifier): Promise<void> {
  const current = identifier || getCurrentUserIdentifier();

  // 1. Delete from Supabase addresses table
  try {
    await supabase.from('addresses').delete().eq('id', addressId);
  } catch (err) {
    console.warn('Error deleting address from Supabase:', err);
  }

  // 2. Delete from Supabase Auth user table metadata
  try {
    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user && Array.isArray(authData.user.user_metadata?.addresses)) {
      const filtered = authData.user.user_metadata.addresses.filter((a: any) => a.id !== addressId);
      await supabase.auth.updateUser({
        data: {
          addresses: filtered,
        },
      });
    }
  } catch {
    // ignore
  }

  // 3. Update local cache
  try {
    const local = localStorage.getItem('meatghar_user_addresses');
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        const filtered = parsed.filter((a) => a.id !== addressId);
        localStorage.setItem('meatghar_user_addresses', JSON.stringify(filtered));
      }
    }
  } catch {
    // ignore
  }
}

/**
 * Set an address as default in Supabase
 */
export async function setDefaultUserAddress(addressId: string, identifier?: UserIdentifier): Promise<void> {
  const current = identifier || getCurrentUserIdentifier();
  const searchValues = [current.phone, current.email, current.uid].filter(Boolean) as string[];

  try {
    if (searchValues.length > 0) {
      const orFilter = searchValues.map((v) => `user_id.eq.${v}`).join(',');
      await supabase.from('addresses').update({ is_default: false }).or(orFilter);
    }
    await supabase.from('addresses').update({ is_default: true }).eq('id', addressId);
  } catch (err) {
    console.warn('Error setting default address in Supabase:', err);
  }

  // Update local cache
  try {
    const local = localStorage.getItem('meatghar_user_addresses');
    if (local) {
      const parsed: SavedAddress[] = JSON.parse(local);
      if (Array.isArray(parsed)) {
        const updated = parsed.map((a) => ({ ...a, isDefault: a.id === addressId }));
        localStorage.setItem('meatghar_user_addresses', JSON.stringify(updated));
      }
    }
  } catch {
    // ignore
  }
}

function searchFilter(current: UserIdentifier): boolean {
  return Boolean(current.phone || current.email || current.uid);
}
