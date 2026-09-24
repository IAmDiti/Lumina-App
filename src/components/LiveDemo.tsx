"use client";

import { useState } from "react";
import Link from "next/link";

type Insights = {
  detected_patterns: string[];
  core_values_mentioned: string[];
  emotional_tone: string;
};

type Result = { entry: string; response: string; insights: Insights };

const EXAMPLES: Result[] = [
  {
    entry:
      "I keep saying yes to things I don't want to do because I'm scared of how people will react if I say no.",
    response:
      "You're describing your \"no\" as a risk to manage rather than a boundary you're allowed to hold. What are you actually afraid will happen if you disappoint someone?",
    insights: {
      detected_patterns: ["Fear of disappointing others"],
      core_values_mentioned: ["harmony"],
      emotional_tone: "anxious",
    },
  },
  {
    entry: "Finished the project at 2am again. I told myself I'd stop doing this to myself but here we are.",
    response:
      "You noticed the pattern in the same breath you repeated it. What does finishing at 2am actually protect you from feeling?",
    insights: {
      detected_patterns: ["Overworking when anxious"],
      core_values_mentioned: ["achievement"],
      emotional_tone: "exhausted",
    },
  },
  {
    entry: "My sister said something small and I've been replaying it for three days like it's a big deal.",
    response:
      "Three days is a long time to carry something \"small.\" What does it mean about you if what she said turns out to be true?",
    insights: {
      detected_patterns: ["Rumination after criticism"],
      core_values_mentioned: ["belonging"],
      emotional_tone: "hurt",
    },
  },
];

const MAX_LEN = 500;

function Chip({ children, tone = "zinc" }: { children: React.ReactNode; tone?: "zinc" | "indigo" | "amber" }) {
  const styles = {
    zinc: "bg-zinc-900/70 text-zinc-300 ring-zinc-700/60",
    indigo: "bg-indigo-500/10 text-indigo-200 ring-indigo-400/25",
    amber: "bg-amber-400/10 text-amber-200 ring-amber-400/20",
  }[tone];
  return <span className={`rounded-full px-2.5 py-0.5 text-xs ring-1 ${styles}`}>{children}</span>;
}

function ResultView({ result, live }: { result: Result; live?: boolean }) {
  const { insights } = result;
  return (
    <div className="animate-fade-in mt-5 space-y-4">
      <div className="rounded-xl border-l-2 border-indigo-400/70 bg-indigo-500/[0.07] px-4 py-3">
        <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-300/80">Lumina</p>
        <p className="leading-relaxed text-indigo-50/90">{result.response}</p>
      </div>

      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4">
        <p className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
          {live ? "What your Identity Board would start tracking" : "On the Identity Board, this becomes"}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {insights.detected_patterns.map((p) => (
            <Chip key={p} tone="amber">
              {p}
            </Chip>
          ))}
          {insights.core_values_mentioned.map((v) => (
            <Chip key={v} tone="indigo">
              {v}
            </Chip>
          ))}
          <Chip>{insights.emotional_tone}</Chip>
        </div>
      </div>
    </div>
  );
}

export function LiveDemo() {
  const [mode, setMode] = useState<"example" | "sandbox">("example");
  const [activeExample, setActiveExample] = useState<Result | null>(null);
  const [draft, setDraft] = useState("");
  const [sandboxResult, setSandboxResult] = useState<Result | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = draft.trim();
  const canSubmit = trimmed.length >= 3 && draft.length <= MAX_LEN && !pending;

  async function submit() {
    if (!canSubmit) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/sandbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSandboxResult({ entry: trimmed, response: data.response, insights: data.insights });
    } catch {
      setError("You appear to be offline. Try again when you're connected.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-2xl px-4 pb-20 sm:px-6" aria-label="Try Lumina">
      <div className="mb-6 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-300">See it work</p>
        <h2 className="mt-3 font-serif text-3xl text-white">Not a mockup. The real thing.</h2>
      </div>

      <div className="relative mb-5 grid grid-cols-2 rounded-lg bg-zinc-900/80 p-1 text-sm ring-1 ring-zinc-800">
        <span
          aria-hidden
          className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-md bg-zinc-800 shadow-sm transition-transform duration-200 ease-out ${
            mode === "sandbox" ? "translate-x-full" : "translate-x-0"
          }`}
        />
        {(["example", "sandbox"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className="relative z-10 rounded-md py-2 text-zinc-400 transition-colors duration-150 aria-pressed:text-zinc-100"
          >
            {m === "example" ? "See an example" : "Try your own"}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 shadow-2xl shadow-black/40 sm:p-6">
        {mode === "example" ? (
          <>
            <p className="mb-3 text-sm text-zinc-500">Click a sample entry:</p>
            <div className="space-y-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.entry}
                  type="button"
                  onClick={() => setActiveExample(ex)}
                  aria-pressed={activeExample?.entry === ex.entry}
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-left text-sm text-zinc-300 transition-colors duration-150 hover:border-zinc-700 hover:bg-zinc-900/70 aria-pressed:border-indigo-400/50 aria-pressed:bg-indigo-500/5"
                >
                  &ldquo;{ex.entry}&rdquo;
                </button>
              ))}
            </div>
            {activeExample && <ResultView result={activeExample} />}
          </>
        ) : (
          <>
            <label htmlFor="sandbox-entry" className="sr-only">
              Try a journal entry
            </label>
            <textarea
              id="sandbox-entry"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={pending}
              rows={4}
              maxLength={MAX_LEN}
              placeholder="Write a few honest sentences about something on your mind…"
              className="block w-full resize-y rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-[15px] leading-relaxed text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-indigo-400/50 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60"
            />
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="font-mono text-xs text-zinc-600">
                {draft.length}/{MAX_LEN} · nothing here is saved
              </span>
              <button
                type="button"
                onClick={() => void submit()}
                disabled={!canSubmit}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-indigo-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
              >
                {pending && <span aria-hidden className="size-2 animate-pulse rounded-full bg-white" />}
                {pending ? "Lumina is listening…" : "Reflect"}
              </button>
            </div>

            {error && (
              <p role="alert" className="animate-fade-in mt-3 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-500/20">
                {error}
              </p>
            )}
            {sandboxResult && <ResultView result={sandboxResult} live />}
          </>
        )}

        {(activeExample || sandboxResult) && (
          <p className="animate-fade-in mt-5 border-t border-zinc-800 pt-4 text-center text-sm text-zinc-400">
            This is one entry, once.{" "}
            <Link href="/login" className="text-indigo-300 hover:text-indigo-200">
              Create a free account
            </Link>{" "}
            and Lumina starts remembering across every one you write.
          </p>
        )}
      </div>
    </section>
  );
}
