import { cookies } from 'next/headers';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

export async function createClient() {
  // Get cookies to potentially manage sessions
  const cookieStore = await cookies();

  // Create Supabase client with proper environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  const supabase = createSupabaseClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  );

  return supabase;
}
