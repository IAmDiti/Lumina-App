import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { getUserId } from "@/lib/supabase/server";
import { OnboardingForm } from "./OnboardingForm";

export const metadata: Metadata = { title: "Preferences" };

export default async function OnboardingPage() {
  const { supabase, userId } = await getUserId();
  if (!userId) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("onboarding_focus, processing_style, reflection_tone")
    .eq("id", userId)
    .maybeSingle();

  const defaults = profile ?? { onboarding_focus: null, processing_style: null, reflection_tone: null };
  const isUpdate = Boolean(defaults.onboarding_focus);

  return (
    <>
      {isUpdate && <AppHeader active="/onboarding" />}
      <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-serif text-4xl text-slate-50">
          {isUpdate ? "Your preferences" : "Let's tune Lumina to you"}
        </h1>
        <p className="mt-3 mb-12 text-slate-400">
          Three quick choices shape how the Active Listener reflects back to you.
        </p>
        <OnboardingForm defaults={defaults} isUpdate={isUpdate} />
      </main>
    </>
  );
}
