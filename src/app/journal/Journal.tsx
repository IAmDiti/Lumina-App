"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LocalTime } from "@/components/LocalTime";
import type { Entry } from "@/lib/types";
import type { Reflection } from "@/lib/lumina/schema";

const DRAFT_KEY = "lumina:draft";
const MAX_LEN = 10_000;

type Insights = Reflection["extracted_insights"];

function readDraft() {
  try {
    return localStorage.getItem(DRAFT_KEY) ?? "";
  } catch {
    return "";
  }
}

function writeDraft(value: string) {
  try {
    if (value) localStorage.setItem(DRAFT_KEY, value);
    else localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Storage unavailable (private mode etc.); drafts just won't persist.
  }
}

function Chip({ children, tone = "zinc" }: { children: React.ReactNode; tone?: "zinc" | "indigo" | "amber" }) {
  const styles = {
    zinc: "bg-zinc-900/70 text-zinc-300 ring-zinc-700/60",
    indigo: "bg-indigo-500/10 text-indigo-200 ring-indigo-400/25",
    amber: "bg-amber-400/10 text-amber-200 ring-amber-400/20",
  }[tone];
  return <span className={`rounded-full px-2.5 py-0.5 text-xs ring-1 ${styles}`}>{children}</span>;
}

function LatestInsights({ insights }: { insights: Insights }) {
  const { detected_patterns, core_values_mentioned, identity_board_update } = insights;
  return (
    <div className="mt-4 space-y-3 border-t border-indigo-400/15 pt-4 text-sm">
      {identity_board_update && (
        <p className="text-zinc-400">
          <span className="mr-1.5 text-xs font-medium uppercase tracking-wider text-indigo-300/80">Board update</span>
          {identity_board_update}
        </p>
      )}
      {(detected_patterns.length > 0 || core_values_mentioned.length > 0) && (
        <div className="flex flex-wrap gap-1.5">
          {core_values_mentioned.map((v) => (
            <Chip key={`v-${v}`} tone="indigo">
              {v}
            </Chip>
          ))}
          {detected_patterns.map((p) => (
            <Chip key={`p-${p}`} tone="amber">
              {p}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}

function EntryCard({ entry, insights }: { entry: Entry; insights?: Insights | null }) {
  return (
    <article className="animate-fade-in rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-5 transition-colors duration-200 hover:border-zinc-700 sm:p-6">
      <header className="mb-3 flex items-center justify-between gap-3 text-xs text-zinc-500">
        <LocalTime iso={entry.created_at} />
        {entry.emotional_tone && <Chip>{entry.emotional_tone}</Chip>}
      </header>
      <p className="whitespace-pre-wrap font-serif text-[17px] leading-relaxed text-zinc-200">{entry.raw_content}</p>
      {entry.ai_response && (
        <div className="mt-5 rounded-xl border-l-2 border-indigo-400/70 bg-indigo-500/[0.07] px-4 py-3">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-300/80">Lumina</p>
          <p className="leading-relaxed text-indigo-50/90">{entry.ai_response}</p>
          {insights && <LatestInsights insights={insights} />}
        </div>
      )}
    </article>
  );
}

export function Journal({ initialEntries }: { initialEntries: Entry[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [added, setAdded] = useState<{ entry: Entry; insights: Insights | null }[]>([]);
  const [, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Restore an unsent draft after mount (localStorage isn't available during SSR).
  useEffect(() => {
    const saved = readDraft();
    // One-time read from an external store after hydration; can't run during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setDraft(saved);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => writeDraft(draft), 300);
    return () => clearTimeout(t);
  }, [draft]);

  const entries = useMemo(() => {
    const seen = new Set<string>();
    const merged: { entry: Entry; insights?: Insights | null }[] = [];
    for (const item of [...added, ...initialEntries.map((entry) => ({ entry }))]) {
      if (seen.has(item.entry.id)) continue;
      seen.add(item.entry.id);
      merged.push(item);
    }
    return merged;
  }, [added, initialEntries]);

  const lastQuestion = entries[0]?.entry.ai_response;
  const trimmed = draft.trim();
  const canSubmit = trimmed.length >= 3 && draft.length <= MAX_LEN && !pending;

  async function submit() {
    if (!canSubmit) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        router.push("/login?next=/journal");
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setAdded((prev) => [{ entry: data.entry as Entry, insights: data.insights as Insights | null }, ...prev]);
      setDraft("");
      writeDraft("");
      // Pull the updated Identity Board from the server.
      startTransition(() => router.refresh());
    } catch {
      setError("You appear to be offline. Your draft is saved; try again when you're connected.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-w-0">
      <section aria-label="New entry" className="mb-10">
        {lastQuestion ? (
          <p className="mb-4 font-serif text-2xl leading-snug text-zinc-300 italic">{lastQuestion}</p>
        ) : (
          <h1 className="mb-4 font-serif text-3xl text-zinc-100">What&apos;s on your mind?</h1>
        )}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 shadow-2xl shadow-black/50 transition-all duration-200 focus-within:border-indigo-400/50 focus-within:ring-4 focus-within:ring-indigo-500/10">
          <label htmlFor="entry" className="sr-only">
            Journal entry
          </label>
          <textarea
            id="entry"
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                void submit();
              }
            }}
            disabled={pending}
            rows={7}
            placeholder={lastQuestion ? "Answer, or write about something else entirely…" : "Write the raw version. No one else will read this."}
            className="block w-full resize-y rounded-t-2xl bg-transparent px-5 py-4 font-serif text-lg leading-relaxed text-zinc-100 placeholder:text-zinc-600 focus:outline-none disabled:opacity-60"
          />
          <div className="flex items-center justify-between gap-3 border-t border-zinc-800/80 px-4 py-3">
            <span className={`font-mono text-xs transition-colors ${draft.length > MAX_LEN ? "text-rose-400" : "text-zinc-600"}`}>
              {draft.length > 0 ? `${draft.length.toLocaleString()} / ${MAX_LEN.toLocaleString()}` : "Ctrl/⌘ + Enter to reflect"}
            </span>
            <button
              type="button"
              onClick={() => void submit()}
              disabled={!canSubmit}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-md shadow-indigo-950/40 transition-all duration-150 hover:bg-indigo-400 hover:shadow-indigo-500/30 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
            >
              {pending && <span aria-hidden className="size-2 animate-pulse rounded-full bg-white" />}
              {pending ? "Lumina is listening…" : "Reflect"}
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="animate-fade-in mt-3 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-500/20">
            {error}
          </p>
        )}
      </section>

      <section aria-label="Past entries" className="space-y-5">
        {entries.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">
            Your reflections will appear here.
          </p>
        ) : (
          entries.map(({ entry, insights }) => <EntryCard key={entry.id} entry={entry} insights={insights} />)
        )}
      </section>

      <p className="mt-12 text-center text-xs leading-relaxed text-zinc-600">
        Lumina is a reflection tool, not a therapist. If you&apos;re in crisis, call or text 988 (US) or contact local emergency services.
      </p>
    </div>
  );
}
