import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  'https://uqwbduinwugaqexsvkxc.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
