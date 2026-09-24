import Link from "next/link";
import type { BoardData } from "@/lib/board";
import { setPatternStatus } from "@/app/board/actions";

function Section({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-5 transition-colors duration-200 hover:border-zinc-700">
      <header className="mb-4">
        <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-indigo-300/80">{title}</h2>
        {caption && <p className="mt-1 text-sm text-zinc-500">{caption}</p>}
      </header>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm italic text-zinc-500">{children}</p>;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function CoreValues({ values, limit }: { values: BoardData["values"]; limit?: number }) {
  const shown = limit ? values.slice(0, limit) : values;
  const max = Math.max(1, ...shown.map((v) => v.count));
  return (
    <Section title="Core values" caption={limit ? undefined : "What you keep coming back to, weighted by how often it shows up."}>
      {shown.length === 0 ? (
        <Empty>Values will surface as you write.</Empty>
      ) : (
        <ul className="space-y-2.5">
          {shown.map((v) => (
            <li key={v.name} className="group">
              <div className="mb-1 flex items-baseline justify-between text-sm">
                <span className="text-zinc-200 transition-colors group-hover:text-zinc-50">{capitalize(v.name)}</span>
                <span className="font-mono text-xs text-zinc-500">{v.count}×</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-zinc-900">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-300 shadow-[0_0_8px_0_rgb(129_140_248/0.5)] transition-[width] duration-500 ease-out"
                  style={{ width: `${Math.max(8, (v.count / max) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

export function Patterns({
  active,
  resolved,
  limit,
  editable,
}: {
  active: BoardData["activePatterns"];
  resolved?: BoardData["resolvedPatterns"];
  limit?: number;
  editable?: boolean;
}) {
  const shown = limit ? active.slice(0, limit) : active;
  return (
    <Section
      title="Recurring triggers & patterns"
      caption={editable ? "Mark a pattern resolved when it no longer has a hold on you. It will reactivate if it resurfaces." : undefined}
    >
      {shown.length === 0 ? (
        <Empty>No active patterns yet.</Empty>
      ) : (
        <ul className="space-y-2">
          {shown.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-3 rounded-lg bg-zinc-900/60 px-3 py-2 transition-colors duration-150 hover:bg-zinc-900"
            >
              <span className="min-w-0 text-sm text-zinc-200">
                {p.pattern_name}
                {p.count >= 3 && (
                  <span className="ml-2 rounded-full bg-amber-400/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-300/90 ring-1 ring-amber-400/20">
                    recurring
                  </span>
                )}
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <span className="font-mono text-xs text-zinc-500">{p.count}×</span>
                {editable && (
                  <form action={setPatternStatus}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="status" value="resolved" />
                    <button
                      type="submit"
                      className="rounded-md px-2 py-1 text-xs text-zinc-400 ring-1 ring-zinc-700 transition-all duration-150 hover:text-emerald-300 hover:ring-emerald-500/40 active:scale-95"
                    >
                      Resolve
                    </button>
                  </form>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}

      {editable && resolved && resolved.length > 0 && (
        <details className="mt-5 group">
          <summary className="cursor-pointer text-sm text-zinc-500 transition-colors hover:text-zinc-300">
            Resolved ({resolved.length})
          </summary>
          <ul className="mt-3 space-y-2">
            {resolved.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 px-3 py-1.5">
                <span className="text-sm text-zinc-500 line-through decoration-zinc-600">{p.pattern_name}</span>
                <form action={setPatternStatus}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="status" value="active" />
                  <button type="submit" className="text-xs text-zinc-500 transition-colors hover:text-zinc-200">
                    Reactivate
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </details>
      )}
    </Section>
  );
}

export function EmotionalLandscape({
  tones,
  recent,
}: {
  tones: BoardData["tones"];
  recent?: BoardData["recentTones"];
}) {
  const max = Math.max(1, ...tones.map((t) => t.count));
  return (
    <Section title="Emotional patterns" caption={recent ? "The dominant feeling in your recent entries." : undefined}>
      {tones.length === 0 ? (
        <Empty>Your emotional landscape will fill in over time.</Empty>
      ) : (
        <>
          <ul className="flex flex-wrap gap-2">
            {tones.slice(0, 12).map((t) => {
              const weight = t.count / max;
              return (
                <li
                  key={t.tone}
                  className="rounded-full px-3 py-1 text-sm ring-1 transition-transform duration-150 hover:scale-105"
                  style={{
                    backgroundColor: `rgb(99 102 241 / ${0.06 + weight * 0.22})`,
                    color: `rgb(${Math.round(203 - weight * 38)} ${Math.round(213 - weight * 33)} 254)`,
                    borderColor: "transparent",
                    boxShadow: `inset 0 0 0 1px rgb(129 140 248 / ${0.15 + weight * 0.3})`,
                  }}
                >
                  {t.tone}
                  <span className="ml-1.5 font-mono text-[11px] opacity-60">{t.count}</span>
                </li>
              );
            })}
          </ul>
          {recent && recent.length > 1 && (
            <div className="mt-5">
              <p className="mb-2 text-xs text-zinc-500">Most recent first</p>
              <ol className="flex flex-wrap gap-1.5 text-xs text-zinc-400">
                {recent.map((r, i) => (
                  <li key={`${r.date}-${i}`} className="rounded bg-zinc-900/80 px-2 py-0.5" title={new Date(r.date).toLocaleString()}>
                    {r.tone}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </>
      )}
    </Section>
  );
}

export function Milestones({ milestones, limit }: { milestones: string[]; limit?: number }) {
  const shown = limit ? milestones.slice(0, limit) : milestones;
  return (
    <Section title="Growth milestones">
      {shown.length === 0 ? (
        <Empty>Each reflection adds a line to your story.</Empty>
      ) : (
        <ol className="relative space-y-4 border-l border-zinc-800 pl-5">
          {shown.map((m, i) => (
            <li key={i} className="relative font-serif text-[15px] leading-relaxed text-zinc-300">
              <span
                aria-hidden
                className={`absolute top-2 -left-[25px] size-2 rounded-full ${i === 0 ? "animate-pulse-ring bg-indigo-300 shadow-[0_0_10px_2px_rgb(129_140_248/0.5)]" : "bg-zinc-700"}`}
              />
              {m}
            </li>
          ))}
        </ol>
      )}
    </Section>
  );
}

/** Compact board for the journal sidebar. */
export function IdentityBoardSummary({ board }: { board: BoardData }) {
  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between px-1">
        <h2 className="font-serif text-xl text-zinc-100">Identity Board</h2>
        <Link href="/board" className="group text-sm text-indigo-300 transition-colors hover:text-indigo-200">
          View all <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
      <CoreValues values={board.values} limit={5} />
      <Patterns active={board.activePatterns} limit={5} />
      <EmotionalLandscape tones={board.tones.slice(0, 8)} />
      <Milestones milestones={board.milestones} limit={3} />
    </div>
  );
}
