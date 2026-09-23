"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Chip({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "indigo" | "amber" }) {
  const styles = {
    slate: "bg-slate-800/70 text-slate-300 ring-slate-700/60",
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
        <p className="text-slate-400">
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

function EntryCard({ entry, insights }: { entry: Entry; insights?: Insights }) {
  return (
    <article className="animate-fade-in rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
      <header className="mb-3 flex items-center justify-between gap-3 text-xs text-slate-500">
        <time dateTime={entry.created_at}>{formatDate(entry.created_at)}</time>
        {entry.emotional_tone && <Chip>{entry.emotional_tone}</Chip>}
      </header>
      <p className="whitespace-pre-wrap font-serif text-[17px] leading-relaxed text-slate-200">{entry.raw_content}</p>
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
  const [added, setAdded] = useState<{ entry: Entry; insights: Insights }[]>([]);
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
    const merged: { entry: Entry; insights?: Insights }[] = [];
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
      setAdded((prev) => [{ entry: data.entry as Entry, insights: data.insights as Insights }, ...prev]);
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
          <p className="mb-4 font-serif text-2xl leading-snug text-slate-300 italic">{lastQuestion}</p>
        ) : (
          <h1 className="mb-4 font-serif text-3xl text-slate-100">What&apos;s on your mind?</h1>
        )}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-2xl shadow-black/30 transition focus-within:border-indigo-400/50 focus-within:ring-4 focus-within:ring-indigo-500/10">
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
            className="block w-full resize-y rounded-t-2xl bg-transparent px-5 py-4 font-serif text-lg leading-relaxed text-slate-100 placeholder:text-slate-600 focus:outline-none disabled:opacity-60"
          />
          <div className="flex items-center justify-between gap-3 border-t border-slate-800/80 px-4 py-3">
            <span className={`font-mono text-xs ${draft.length > MAX_LEN ? "text-rose-400" : "text-slate-600"}`}>
              {draft.length > 0 ? `${draft.length.toLocaleString()} / ${MAX_LEN.toLocaleString()}` : "Ctrl/⌘ + Enter to reflect"}
            </span>
            <button
              type="button"
              onClick={() => void submit()}
              disabled={!canSubmit}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending && <span aria-hidden className="size-2 animate-pulse rounded-full bg-white" />}
              {pending ? "Lumina is listening…" : "Reflect"}
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-3 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-500/20">
            {error}
          </p>
        )}
      </section>

      <section aria-label="Past entries" className="space-y-5">
        {entries.length === 0 ? (
          <p className="text-center text-sm text-slate-500">
            Your reflections will appear here.
          </p>
        ) : (
          entries.map(({ entry, insights }) => <EntryCard key={entry.id} entry={entry} insights={insights} />)
        )}
      </section>

      <p className="mt-12 text-center text-xs leading-relaxed text-slate-600">
        Lumina is a reflection tool, not a therapist. If you&apos;re in crisis, call or text 988 (US) or contact local emergency services.
      </p>
    </div>
  );
}
