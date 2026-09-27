"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { cancelSubscriptionAction, type CancelSubscriptionState } from "@/app/settings/actions";

function CancelButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-100 transition-all duration-150 hover:bg-zinc-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Cancelling…" : "Yes, cancel my subscription"}
    </button>
  );
}

export function CancelSubscriptionForm() {
  const [state, action] = useActionState<CancelSubscriptionState, FormData>(cancelSubscriptionAction, {});
  const [open, setOpen] = useState(false);

  if (state.success) {
    return (
      <p role="status" className="animate-fade-in rounded-lg bg-indigo-500/10 px-3 py-2 text-sm text-indigo-200 ring-1 ring-indigo-500/20">
        Your subscription has been cancelled. This can take a few seconds to reflect here — refresh
        if your plan doesn&apos;t update right away.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors duration-150 hover:bg-zinc-900/60"
      >
        Cancel subscription
      </button>
    );
  }

  return (
    <form action={action} className="animate-fade-in space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <p className="text-sm leading-relaxed text-zinc-300">
        This stops future billing and moves you to the Free plan right away. Your entries and
        everything Lumina has learned about you are kept — upgrade again anytime.
      </p>

      {state.error && (
        <p role="alert" className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-500/20">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <CancelButton />
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          Never mind
        </button>
      </div>
    </form>
  );
}
