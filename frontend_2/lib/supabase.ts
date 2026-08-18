import { createClient } from '@supabase/supabase-js'

// 1. Check process.env first (for SSR/Netlify Server),
// then fallback to import.meta.env (for the browser)
const supabaseUrl =
  process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

// 2. Add a safety check so it fails with a clear message instead of a generic 500
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check Netlify UI.',
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
