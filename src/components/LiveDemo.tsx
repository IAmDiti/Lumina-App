"use client";

import { useEffect, useRef, useState } from "react";
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
const THINKING_DELAY_MS = 750;

type ChipTone = "zinc" | "indigo" | "amber" | "rose" | "sky";

function Chip({ children, tone = "zinc" }: { children: React.ReactNode; tone?: ChipTone }) {
  const styles: Record<ChipTone, string> = {
    zinc: "bg-zinc-900/70 text-zinc-300 ring-zinc-700/60",
    indigo: "bg-indigo-500/10 text-indigo-200 ring-indigo-400/25",
    amber: "bg-amber-400/10 text-amber-200 ring-amber-400/20",
    rose: "bg-rose-400/10 text-rose-200 ring-rose-400/20",
    sky: "bg-sky-400/10 text-sky-200 ring-sky-400/20",
  };
  return <span className={`rounded-full px-2.5 py-0.5 text-xs ring-1 ${styles[tone]}`}>{children}</span>;
}

/** Emotional tones get their own color logic instead of one flat gray chip. */
function toneOf(tone: string): ChipTone {
  const t = tone.toLowerCase();
  if (/anxious|nervous|worried|scared|afraid|stressed|tense/.test(t)) return "amber";
  if (/exhausted|tired|drained|numb|flat|overwhelmed/.test(t)) return "zinc";
  if (/hurt|sad|lonely|grief|ashamed|guilt|rejected/.test(t)) return "rose";
  if (/calm|hopeful|grateful|content|curious|relieved/.test(t)) return "sky";
  if (/angry|frustrated|resentful|irritated|defensive/.test(t)) return "indigo";
  return "zinc";
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Small avatar echoing the Logo mark, so the response reads as a message from someone, not a UI state. */
function LuminaAvatar() {
  return (
    <span
      aria-hidden
      className="relative mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-indigo-500/15 ring-1 ring-indigo-400/40"
    >
      <span className="size-2 rounded-full bg-indigo-300 shadow-[0_0_10px_3px_rgb(129_140_248/0.55)]" />
    </span>
  );
}

function ThinkingBubble() {
  return (
    <div className="animate-fade-in mt-5 flex items-center gap-3 rounded-2xl border-l-2 border-indigo-400/50 bg-indigo-500/[0.05] px-4 py-3.5">
      <LuminaAvatar />
      <span className="flex items-center gap-1" aria-hidden>
        <span className="animate-typing-dot size-1.5 rounded-full bg-indigo-300/70" style={{ animationDelay: "0ms" }} />
        <span className="animate-typing-dot size-1.5 rounded-full bg-indigo-300/70" style={{ animationDelay: "160ms" }} />
        <span className="animate-typing-dot size-1.5 rounded-full bg-indigo-300/70" style={{ animationDelay: "320ms" }} />
      </span>
      <span className="text-xs text-zinc-500">Lumina is reading…</span>
    </div>
  );
}

function ResultView({ result, live }: { result: Result; live?: boolean }) {
  const { insights } = result;
  const value = insights.core_values_mentioned[0];
  const pattern = insights.detected_patterns[0];

  return (
    <div className="animate-fade-in mt-5 space-y-4">
      {/* The response reads as a message — an avatar, a name, a reply. */}
      <div className="flex gap-3 rounded-2xl border-l-2 border-indigo-400/70 bg-indigo-500/[0.07] px-4 py-3.5">
        <LuminaAvatar />
        <div className="min-w-0">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-300/80">Lumina</p>
          <p className="font-serif leading-relaxed text-indigo-50/90">{result.response}</p>
        </div>
      </div>

      {/* The Identity Board update reads as structured data, not more prose. */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
          {live ? "What your Identity Board would start tracking" : "On the Identity Board, this becomes"}
        </p>

        <div className="grid gap-2 sm:grid-cols-2">
          {value && (
            <div className="rounded-lg bg-zinc-900/60 px-3 py-2.5">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">Core value</p>
              <div className="mt-1.5 flex items-baseline justify-between gap-2">
                <span className="text-sm text-zinc-200">{capitalize(value)}</span>
                <span className="font-mono text-[10px] text-zinc-600">1×</span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-indigo-500 to-indigo-300" />
              </div>
            </div>
          )}

          {pattern && (
            <div className="rounded-lg bg-zinc-900/60 px-3 py-2.5">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">Pattern noticed</p>
              <div className="mt-1.5 flex items-baseline justify-between gap-2">
                <span className="text-sm text-zinc-200">{pattern}</span>
                <span className="font-mono text-[10px] text-zinc-600">1×</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">Tone</span>
          <Chip tone={toneOf(insights.emotional_tone)}>{insights.emotional_tone}</Chip>
        </div>
      </div>
    </div>
  );
}

export function LiveDemo() {
  const [mode, setMode] = useState<"example" | "sandbox">("example");
  const [selectedExample, setSelectedExample] = useState<Result | null>(null);
  const [revealedExample, setRevealedExample] = useState<Result | null>(null);
  const [draft, setDraft] = useState("");
  const [sandboxResult, setSandboxResult] = useState<Result | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const thinkingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (thinkingTimeout.current) clearTimeout(thinkingTimeout.current);
    };
  }, []);

  const trimmed = draft.trim();
  const canSubmit = trimmed.length >= 3 && draft.length <= MAX_LEN && !pending;
  const exampleThinking = selectedExample !== null && revealedExample?.entry !== selectedExample.entry;

  function pickExample(ex: Result) {
    if (thinkingTimeout.current) clearTimeout(thinkingTimeout.current);
    if (selectedExample?.entry === ex.entry) {
      setSelectedExample(null);
      setRevealedExample(null);
      return;
    }
    setSelectedExample(ex);
    setRevealedExample(null);
    thinkingTimeout.current = setTimeout(() => setRevealedExample(ex), THINKING_DELAY_MS);
  }

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
                  onClick={() => pickExample(ex)}
                  aria-pressed={selectedExample?.entry === ex.entry}
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-left font-serif text-[15px] text-zinc-300 transition-colors duration-150 hover:border-zinc-700 hover:bg-zinc-900/70 aria-pressed:border-indigo-400/50 aria-pressed:bg-indigo-500/5"
                >
                  &ldquo;{ex.entry}&rdquo;
                </button>
              ))}
            </div>
            {exampleThinking && <ThinkingBubble />}
            {revealedExample && !exampleThinking && <ResultView result={revealedExample} />}
          </>
        ) : sandboxResult ? (
          <>
            <ResultView result={sandboxResult} live />
            <p className="animate-fade-in mt-5 rounded-xl border border-indigo-400/20 bg-indigo-500/[0.06] px-4 py-3 text-center text-sm text-zinc-300">
              That&apos;s today&apos;s free sandbox reflection used.{" "}
              <Link href="/login" className="text-indigo-300 hover:text-indigo-200">
                Create a free account
              </Link>{" "}
              to keep reflecting, every day.
            </p>
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
              className="block w-full resize-y rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 font-serif text-[15px] leading-relaxed text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-indigo-400/50 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60"
            />
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="font-mono text-xs text-zinc-600">
                {draft.length}/{MAX_LEN} · one free try a day, nothing here is saved
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
          </>
        )}

        {mode === "example" && revealedExample && !exampleThinking && (
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
