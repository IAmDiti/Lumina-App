"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { deleteAccount, type DeleteAccountState } from "@/app/settings/actions";
import type { Plan } from "@/lib/subscription";

function DangerButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="inline-flex items-center justify-center rounded-lg bg-rose-500/90 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-rose-950/40 transition-all duration-150 hover:bg-rose-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
    >
      {pending ? "Deleting…" : "Permanently delete my account"}
    </button>
  );
}

export function DeleteAccountForm({ plan }: { plan: Plan }) {
  const [state, action] = useActionState<DeleteAccountState, FormData>(deleteAccount, {});
  const [confirm, setConfirm] = useState("");
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-rose-500/30 px-4 py-2.5 text-sm font-medium text-rose-300 transition-colors duration-150 hover:bg-rose-500/10"
      >
        Delete my account
      </button>
    );
  }

  return (
    <form action={action} className="animate-fade-in space-y-4 rounded-xl border border-rose-500/20 bg-rose-500/[0.04] p-5">
      <p className="text-sm leading-relaxed text-zinc-300">
        This permanently deletes your account, every entry, and everything Lumina has learned about
        you. There is no undo.
        {plan === "paid" && " Your subscription will also be cancelled, so you won't be billed again."}
      </p>

      <label className="block space-y-1.5">
        <span className="text-sm text-zinc-400">
          Type <span className="font-mono text-rose-300">DELETE</span> to confirm
        </span>
        <input
          name="confirm"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="off"
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/70 px-3.5 py-2.5 text-zinc-100 outline-none transition-colors duration-150 hover:border-zinc-700 focus:border-rose-400/60 focus:ring-2 focus:ring-rose-500/20"
        />
      </label>

      {state.error && (
        <p role="alert" className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-500/20">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <DangerButton disabled={confirm !== "DELETE"} />
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
