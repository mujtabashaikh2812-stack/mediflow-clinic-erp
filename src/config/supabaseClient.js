import { createClient } from '@supabase/supabase-js';

// Default environment keys (or fallback to user session config)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || sessionStorage.getItem('MEDIFLOW_SUPABASE_URL') || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || sessionStorage.getItem('MEDIFLOW_SUPABASE_ANON_KEY') || '';

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://'));
};

export const getSupabaseConfig = () => ({
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  isConfigured: isSupabaseConfigured()
});

export const updateSupabaseConfig = (url, anonKey) => {
  if (url && anonKey) {
    sessionStorage.setItem('MEDIFLOW_SUPABASE_URL', url.trim());
    sessionStorage.setItem('MEDIFLOW_SUPABASE_ANON_KEY', anonKey.trim());
    window.location.reload();
  }
};

export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // Strict zero persistent disk auth for PHI privacy
        autoRefreshToken: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : null;
