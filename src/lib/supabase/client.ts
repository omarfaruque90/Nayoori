import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Hardcoded Supabase Credentials
const supabaseUrl = 'https://qxrdqkacaingrppxawvf.supabase.co';
const supabaseAnonKey = 'sb_publishable_49XHNcAwCu_RQF1qziAxow_XhT8J4cf';

// ─── Singleton Client Initialization ─────────────────
// This avoids the "Multiple GoTrueClient instances" warning caused by Next.js Hot Module Replacement

const globalForSupabase = globalThis as unknown as {
  supabaseInstance: SupabaseClient | undefined;
};

const createSupabaseClient = () => {
  return createClient(supabaseUrl!, supabaseAnonKey!);
};

// Use the existing client if it exists, otherwise create a new one
export const supabase = 
  globalForSupabase.supabaseInstance ?? createSupabaseClient();

// In development, bind the client to the global object so it persists across HMR updates
if (process.env.NODE_ENV !== 'production') {
  globalForSupabase.supabaseInstance = supabase;
}
