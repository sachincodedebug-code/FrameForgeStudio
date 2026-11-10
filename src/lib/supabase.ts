import { createClient } from '@supabase/supabase-js';
const url = import.meta.env.VITE_SUPABASE_URL; const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const supabase = url && key ? createClient(url, key, { auth: { persistSession:true, autoRefreshToken:true, storageKey:'frameforge-session' } }) : null;
export function requireSupabase(){ if(!supabase) throw new Error('Supabase is not configured. Check .env.local.'); return supabase; }
