"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getUserId } from "@/lib/supabase/server";
import { FOCUS_OPTIONS, STYLE_OPTIONS, TONE_OPTIONS, isKeyOf } from "@/lib/lumina/preferences";

export type OnboardingState = { error?: string };

export async function savePreferences(
  _prev: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const focus = formData.get("onboarding_focus");
  const style = formData.get("processing_style");
  const tone = formData.get("reflection_tone");

  if (!isKeyOf(FOCUS_OPTIONS, focus) || !isKeyOf(STYLE_OPTIONS, style) || !isKeyOf(TONE_OPTIONS, tone)) {
    return { error: "Pick one option in each section." };
  }

  const { supabase, userId, email } = await getUserId();
  if (!userId) redirect("/login");

  // Upsert rather than update: an account created before the profile
  // trigger existed (or where it silently didn't fire) has no public.users
  // row yet, and an update against a missing row affects zero rows without
  // erroring, so the save would appear to work while doing nothing.
  const { error } = await supabase.from("users").upsert(
    { id: userId, email: email ?? "", onboarding_focus: focus, processing_style: style, reflection_tone: tone },
    { onConflict: "id" },
  );
  if (error) {
    console.error("savePreferences:", error);
    return { error: "Couldn't save your preferences. Please try again." };
  }

  // Same self-healing for the Identity Board row the same trigger creates;
  // ignoreDuplicates leaves an existing row (and its data) untouched.
  const { error: identityError } = await supabase
    .from("identity_profile")
    .upsert({ user_id: userId }, { onConflict: "user_id", ignoreDuplicates: true });
  if (identityError) console.error("savePreferences (identity_profile):", identityError);

  revalidatePath("/", "layout");
  redirect("/journal");
}
