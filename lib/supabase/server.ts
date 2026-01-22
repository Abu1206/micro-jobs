import { cookies } from 'next/headers';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

export function createClient() {
  // You can still access cookies if you need them for custom logic
  const cookieStore = cookies();

  // Directly create a Supabase client (no SSR helper needed)
  const supabase = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Optionally, you could read/write cookies manually here if needed
  // e.g., cookieStore.get('access_token') or cookieStore.set('something', 'value')

  return supabase;
}
