import { createClient } from '@supabase/supabase-js';
import { config } from '../config/config';
import type { Database } from '../types/supabase';

if (!config.supabase.url || !config.supabase.serviceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a Supabase client with the service role key for backend operations
export const supabase = createClient<Database>(
  config.supabase.url,
  config.supabase.serviceKey
);