import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client for privileged server-only writes — currently just the
 * Lemon Squeezy webhook syncing subscription state. Bypasses RLS entirely,
 * so this must never be reachable from a request we haven't authenticated
 * ourselves (e.g. by verifying the webhook signature first).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing Supabase admin env: set SUPABASE_SERVICE_ROLE_KEY (see .env.example)",
    );
  }
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}
