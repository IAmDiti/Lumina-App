import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isAdmin } from "@/lib/admin";

export type Plan = "free" | "paid";

export const PLAN_LIMITS: Record<Plan, { dailyEntries: number; memory: boolean }> = {
  free: { dailyEntries: Number(process.env.LUMINA_FREE_DAILY_LIMIT ?? 5), memory: false },
  paid: { dailyEntries: Number(process.env.LUMINA_PAID_DAILY_LIMIT ?? 100), memory: true },
};

/**
 * Reads the caller's plan. Admins (ADMIN_EMAILS) always get paid access,
 * regardless of subscription state. Otherwise a missing subscription row
 * (no row yet) defaults to free.
 */
export async function getPlan(
  supabase: SupabaseClient,
  userId: string,
  email?: string | null,
): Promise<Plan> {
  if (isAdmin(email)) return "paid";

  const { data } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", userId)
    .maybeSingle();
  return data?.plan === "paid" ? "paid" : "free";
}
