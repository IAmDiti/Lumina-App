import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export type Plan = "free" | "paid";

export const PLAN_LIMITS: Record<Plan, { dailyEntries: number; memory: boolean }> = {
  free: { dailyEntries: Number(process.env.LUMINA_FREE_DAILY_LIMIT ?? 5), memory: false },
  paid: { dailyEntries: Number(process.env.LUMINA_PAID_DAILY_LIMIT ?? 100), memory: true },
};

/** Reads the caller's plan. A missing row (no subscription yet) defaults to free. */
export async function getPlan(supabase: SupabaseClient, userId: string): Promise<Plan> {
  const { data } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", userId)
    .maybeSingle();
  return data?.plan === "paid" ? "paid" : "free";
}
