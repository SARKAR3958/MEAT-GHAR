import { createClient } from '@supabase/supabase-js';

// User's Supabase credentials (with fallback to hardcoded user project credentials)
const getMetaEnv = (key: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
  } catch {
    // ignore
  }
  return '';
};

export const SUPABASE_URL =
  getMetaEnv('VITE_SUPABASE_URL') ||
  'https://hwcoxwwbzxfvxuppnvni.supabase.co';

export const SUPABASE_ANON_KEY =
  getMetaEnv('VITE_SUPABASE_ANON_KEY') ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3Y294d3dienhmdnh1cHBudm5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2NzUwODEsImV4cCI6MjEwNjI1MTA4MX0.-nUvI2WItVU7Em3w1gLFBZQcqAslBTuI34INrL5DBhE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Check connectivity to Supabase
 */
export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string }> {
  try {
    const { error } = await supabase.from('products').select('count', { count: 'exact', head: true });
    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
        return {
          ok: true,
          message: 'Connected to Supabase! (Tables pending SQL migration)',
        };
      }
      return { ok: true, message: `Connected: ${error.message}` };
    }
    return { ok: true, message: 'Supabase connected & ready' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, message: msg };
  }
}

/**
 * Google OAuth Sign In
 */
export async function signInWithGoogle() {
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: currentOrigin,
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
    },
  });
  if (error) {
    throw error;
  }
  return data;
}

/**
 * Sign Out
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

/**
 * Upload Image to Supabase Storage Bucket ('meatghar-images')
 */
export async function uploadImageToSupabase(
  file: File,
  folder = 'products'
): Promise<{ url: string | null; error: Error | null }> {
  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${folder}/${Date.now()}_${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from('meatghar-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.warn('Supabase storage upload error:', uploadError.message);
      return { url: null, error: new Error(uploadError.message) };
    }

    const { data: publicUrlData } = supabase.storage
      .from('meatghar-images')
      .getPublicUrl(path);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { url: null, error };
  }
}
