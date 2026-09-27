"use server";

import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { cancelSubscription } from "@/lib/lumina/lemonsqueezy";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserId } from "@/lib/supabase/server";

export type DeleteAccountState = { error?: string };

/**
 * Permanently deletes the signed-in user's account: cancels any active Lemon
 * Squeezy subscription first (so they aren't billed after their data is
 * gone), then deletes the auth user, which cascades to every table that
 * references it (entries, patterns, identity_profile, subscriptions,
 * syntheses, voice_transcriptions). Irreversible.
 */
export async function deleteAccount(
  _prev: DeleteAccountState,
  formData: FormData,
): Promise<DeleteAccountState> {
  const { supabase, userId, email } = await getUserId();
  if (!userId) redirect("/login");

  if (formData.get("confirm") !== "DELETE") {
    return { error: 'Type "DELETE" to confirm.' };
  }

  if (isAdmin(email)) {
    return { error: "Admin accounts can't be deleted from this page." };
  }

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, lemonsqueezy_subscription_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (sub?.plan === "paid" && sub.lemonsqueezy_subscription_id) {
    const cancelled = await cancelSubscription(sub.lemonsqueezy_subscription_id);
    if (!cancelled) {
      return {
        error:
          "We couldn't confirm your subscription was cancelled, so we stopped before deleting anything. Please try again in a moment, or email support@luminajournal.app.",
      };
    }
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) {
    console.error("[lumina] failed to delete user", userId, error);
    return { error: "Something went wrong deleting your account. Please try again or contact support." };
  }

  await supabase.auth.signOut();
  redirect("/?deleted=1");
}
