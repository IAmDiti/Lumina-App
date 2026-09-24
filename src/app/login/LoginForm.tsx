"use client";

import { useActionState, useState } from "react";
import { authenticate, type AuthState } from "./actions";
import { SubmitButton } from "@/components/SubmitButton";

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-zinc-900/70 px-3.5 py-2.5 text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors duration-150 hover:border-zinc-700 focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-500/25";

export function LoginForm({ next, initialError }: { next?: string; initialError?: string }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [state, action] = useActionState<AuthState, FormData>(authenticate, {
    error: initialError,
  });

  return (
    <div className="w-full">
      <div className="relative mb-6 grid grid-cols-2 rounded-lg bg-zinc-900/80 p-1 text-sm ring-1 ring-zinc-800">
        <span
          aria-hidden
          className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-md bg-zinc-800 shadow-sm transition-transform duration-200 ease-out ${
            mode === "signup" ? "translate-x-full" : "translate-x-0"
          }`}
        />
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className="relative z-10 rounded-md py-2 text-zinc-400 transition-colors duration-150 aria-pressed:text-zinc-100"
          >
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <form action={action} className="space-y-4">
        <input type="hidden" name="mode" value={mode} />
        {next && <input type="hidden" name="next" value={next} />}
        <label className="block space-y-1.5">
          <span className="text-sm text-zinc-400">Email</span>
          <input name="email" type="email" autoComplete="email" required className={inputClass} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm text-zinc-400">Password</span>
          <input
            name="password"
            type="password"
            minLength={8}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            required
            className={inputClass}
          />
        </label>

        {state.error && (
          <p role="alert" className="animate-fade-in rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-500/20">
            {state.error}
          </p>
        )}
        {state.message && (
          <p role="status" className="animate-fade-in rounded-lg bg-indigo-500/10 px-3 py-2 text-sm text-indigo-200 ring-1 ring-indigo-500/20">
            {state.message}
          </p>
        )}

        <SubmitButton className="w-full" pendingLabel="One moment…">
          {mode === "signin" ? "Sign in" : "Create account"}
        </SubmitButton>
      </form>
    </div>
  );
}
