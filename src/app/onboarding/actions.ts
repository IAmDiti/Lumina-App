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

  const { supabase, userId } = await getUserId();
  if (!userId) redirect("/login");

  const { error } = await supabase
    .from("users")
    .update({ onboarding_focus: focus, processing_style: style, reflection_tone: tone })
    .eq("id", userId);
  if (error) return { error: "Couldn't save your preferences. Please try again." };

  revalidatePath("/", "layout");
  redirect("/journal");
}
