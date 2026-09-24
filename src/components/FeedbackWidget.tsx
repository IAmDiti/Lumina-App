"use client";

import { useState } from "react";

type FeedbackType = "idea" | "bug";

const MAX_LEN = 2000;

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("idea");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const trimmed = message.trim();
  const canSubmit = trimmed.length >= 3 && message.length <= MAX_LEN && !pending;

  function toggleOpen() {
    setOpen((v) => {
      const next = !v;
      if (next && sent) {
        setSent(false);
        setType("idea");
      }
      return next;
    });
    setError(null);
  }

  async function submit() {
    if (!canSubmit) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, message: trimmed, pageUrl: window.location.pathname }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSent(true);
      setMessage("");
    } catch {
      setError("You appear to be offline. Try again when you're connected.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-30">
      {open && (
        <div className="animate-fade-in mb-3 w-72 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-4 shadow-2xl shadow-black/60 backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-white">Ideas &amp; bugs</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="grid size-6 place-items-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-200"
            >
              <svg viewBox="0 0 24 24" fill="none" className="size-4">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {sent ? (
            <p className="animate-fade-in rounded-lg bg-indigo-500/10 px-3 py-2.5 text-sm text-indigo-200 ring-1 ring-indigo-500/20">
              Thanks — that&apos;s in front of us now.
            </p>
          ) : (
            <>
              <div className="relative mb-3 grid grid-cols-2 rounded-lg bg-zinc-900/80 p-1 text-xs ring-1 ring-zinc-800">
                <span
                  aria-hidden
                  className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-md bg-zinc-800 shadow-sm transition-transform duration-200 ease-out ${
                    type === "bug" ? "translate-x-full" : "translate-x-0"
                  }`}
                />
                {(["idea", "bug"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    aria-pressed={type === t}
                    className="relative z-10 rounded-md py-1.5 text-zinc-400 transition-colors duration-150 aria-pressed:text-zinc-100"
                  >
                    {t === "idea" ? "Idea" : "Bug"}
                  </button>
                ))}
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={pending}
                rows={4}
                maxLength={MAX_LEN}
                placeholder={type === "idea" ? "What should Lumina do?" : "What went wrong?"}
                className="block w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
              />

              {error && (
                <p
                  role="alert"
                  className="animate-fade-in mt-2 rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-300 ring-1 ring-rose-500/20"
                >
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={() => void submit()}
                disabled={!canSubmit}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-indigo-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
              >
                {pending ? "Sending…" : "Send"}
              </button>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-950/90 px-3.5 py-2 text-xs font-medium text-zinc-300 shadow-lg shadow-black/40 backdrop-blur transition-all duration-150 hover:border-zinc-700 hover:text-white active:scale-95"
      >
        <span aria-hidden className="size-1.5 rounded-full bg-indigo-400" />
        Ideas + Bugs
      </button>
    </div>
  );
}
