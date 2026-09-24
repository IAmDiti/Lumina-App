import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseEnv } from "./env";

export async function createClient() {
  const cookieStore = await cookies();
  const { url, key } = supabaseEnv();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // The proxy refreshes the session, so this is safe to ignore.
        }
      },
    },
  });
}

/** Returns the signed-in user's id and email, or null. Verifies the JWT server-side. */
export async function getUserId() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return {
    supabase,
    userId: (data?.claims?.sub as string | undefined) ?? null,
    email: (data?.claims?.email as string | undefined) ?? null,
  };
}
