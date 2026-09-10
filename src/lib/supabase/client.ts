import { createBrowserClient } from "@supabase/ssr";

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(
    url &&
    anonKey &&
    (url.startsWith("http://") || url.startsWith("https://")) &&
    !url.includes("your_supabase_url") &&
    !url.includes("placeholder") &&
    !anonKey.includes("your_supabase_anon_key") &&
    !anonKey.includes("placeholder")
  );
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const validUrl =
    url && (url.startsWith("http://") || url.startsWith("https://")) && !url.includes("your_supabase_url")
      ? url
      : "https://placeholder-project.supabase.co";

  const validKey =
    anonKey && !anonKey.includes("your_supabase_anon_key")
      ? anonKey
      : "placeholder-anon-key";

  return createBrowserClient(validUrl, validKey);
}
