import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file.',
  )
}

// Global singleton to prevent multiple Supabase clients during Next.js hot-reloading
const globalForSupabase = globalThis as unknown as {
  supabase: ReturnType<typeof createClient> | undefined
}

export const supabase =
  globalForSupabase.supabase ?? createClient(supabaseUrl, supabaseKey)

if (process.env.NODE_ENV !== 'production') {
  globalForSupabase.supabase = supabase
}