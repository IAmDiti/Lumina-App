import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { getPlan } from "@/lib/subscription";
import { getUserId } from "@/lib/supabase/server";
import { OnboardingForm } from "./OnboardingForm";

export const metadata: Metadata = { title: "Preferences" };

export default async function OnboardingPage() {
  const { supabase, userId, email } = await getUserId();
  if (!userId) redirect("/login");

  const [{ data: profile }, plan] = await Promise.all([
    supabase
      .from("users")
      .select("onboarding_focus, processing_style, reflection_tone")
      .eq("id", userId)
      .maybeSingle(),
    getPlan(supabase, userId, email),
  ]);

  const defaults = profile ?? { onboarding_focus: null, processing_style: null, reflection_tone: null };
  const isUpdate = Boolean(defaults.onboarding_focus);

  return (
    <>
      {isUpdate && <AppHeader active="/onboarding" plan={plan} />}
      <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-serif text-4xl text-zinc-50">
          {isUpdate ? "Your preferences" : "Let's tune Lumina to you"}
        </h1>
        <p className="mt-3 mb-12 text-zinc-400">
          Three quick choices shape how the Active Listener reflects back to you.
        </p>
        <OnboardingForm defaults={defaults} isUpdate={isUpdate} />
      </main>
    </>
  );
}
