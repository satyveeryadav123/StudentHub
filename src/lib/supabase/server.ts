import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getSafeCredentials() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const validUrl = url && (url.startsWith("http://") || url.startsWith("https://")) && !url.includes("your_supabase_url")
    ? url
    : "https://placeholder-project.supabase.co";

  const validAnonKey = anonKey && !anonKey.includes("your_supabase_anon_key")
    ? anonKey
    : "placeholder-anon-key";

  const validServiceKey = serviceKey && !serviceKey.includes("your_service_role_key")
    ? serviceKey
    : validAnonKey;

  return { validUrl, validAnonKey, validServiceKey };
}

export async function createClient() {
  const cookieStore = await cookies();
  const { validUrl, validAnonKey } = getSafeCredentials();

  return createServerClient(validUrl, validAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Handled in middleware
        }
      },
    },
  });
}

export function createAdminClient() {
  const { validUrl, validServiceKey } = getSafeCredentials();

  return createServerClient(validUrl, validServiceKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {},
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
