import { createClient } from '@supabase/supabase-js';

// Access environment variables for your Supabase URL and Anon Key
// Note: You will need to create a .env.local file with these variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
