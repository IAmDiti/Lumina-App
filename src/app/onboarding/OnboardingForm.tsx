"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import { FOCUS_OPTIONS, STYLE_OPTIONS, TONE_OPTIONS } from "@/lib/lumina/preferences";
import { savePreferences, type OnboardingState } from "./actions";

type Options = Record<string, { label: string; hint: string }>;

function OptionGroup({
  step,
  name,
  legend,
  description,
  options,
  defaultValue,
}: {
  step: number;
  name: string;
  legend: string;
  description: string;
  options: Options;
  defaultValue: string | null;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-4">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-indigo-300/80">
          Step {step}
        </span>
        <span className="mt-1 block font-serif text-2xl text-slate-100">{legend}</span>
        <span className="mt-1 block text-sm text-slate-400">{description}</span>
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {Object.entries(options).map(([value, opt]) => (
          <label
            key={value}
            className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition-colors hover:border-slate-700 has-[:checked]:border-indigo-400/60 has-[:checked]:bg-indigo-500/10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-400/50"
          >
            <input
              type="radio"
              name={name}
              value={value}
              defaultChecked={defaultValue === value}
              required
              className="sr-only"
            />
            <span className="block font-medium text-slate-100">{opt.label}</span>
            <span className="mt-0.5 block text-sm text-slate-400">{opt.hint}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function OnboardingForm({
  defaults,
  isUpdate,
}: {
  defaults: { onboarding_focus: string | null; processing_style: string | null; reflection_tone: string | null };
  isUpdate: boolean;
}) {
  const [state, action] = useActionState<OnboardingState, FormData>(savePreferences, {});

  return (
    <form action={action} className="space-y-12">
      <OptionGroup
        step={1}
        name="onboarding_focus"
        legend="What brings you here?"
        description="Lumina will pay closer attention to this."
        options={FOCUS_OPTIONS}
        defaultValue={defaults.onboarding_focus}
      />
      <OptionGroup
        step={2}
        name="processing_style"
        legend="How do you process things?"
        description="So reflections meet you where you think."
        options={STYLE_OPTIONS}
        defaultValue={defaults.processing_style}
      />
      <OptionGroup
        step={3}
        name="reflection_tone"
        legend="How should Lumina speak to you?"
        description="You can change this any time."
        options={TONE_OPTIONS}
        defaultValue={defaults.reflection_tone}
      />

      {state.error && (
        <p role="alert" className="text-sm text-rose-300">
          {state.error}
        </p>
      )}

      <div className="flex justify-end">
        <SubmitButton pendingLabel="Saving…">{isUpdate ? "Save preferences" : "Begin journaling"}</SubmitButton>
      </div>
    </form>
  );
}
