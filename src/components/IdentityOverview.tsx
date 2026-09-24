import type { BoardData } from "@/lib/board";

type RankedItem = { name: string; count: number; kind: "value" | "pattern" };

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * A single at-a-glance view combining values + patterns by magnitude, plus
 * emotional tone over time — the two dimensions the per-category cards below
 * don't show together (relative ranking across both, and a timeline).
 * Collapsed by default; click the header to expand.
 */
export function IdentityOverview({ board }: { board: BoardData }) {
  const ranked: RankedItem[] = [
    ...board.values.map((v) => ({ name: v.name, count: v.count, kind: "value" as const })),
    ...board.activePatterns.map((p) => ({ name: p.pattern_name, count: p.count, kind: "pattern" as const })),
  ]
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  const rankedMax = Math.max(1, ...ranked.map((r) => r.count));

  const toneMax = Math.max(1, ...board.tones.map((t) => t.count));
  const toneCount = new Map(board.tones.map((t) => [t.tone, t.count]));
  const timeline = [...board.recentTones].reverse(); // oldest -> newest, reads left to right

  if (ranked.length === 0 && timeline.length < 2) return null;

  return (
    <details className="group rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-5 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-indigo-300/80">Overview</h2>
          <p className="mt-1 text-sm text-zinc-500">Click to see everything ranked and laid out together.</p>
        </div>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="size-5 shrink-0 text-zinc-500 transition-transform duration-200 group-open:rotate-180"
        >
          <path
            d="M6 9l6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>

      <div className="mt-5">
        {ranked.length > 0 && (
          <div className={timeline.length > 1 ? "mb-6" : ""}>
            <div className="mb-3 flex items-center gap-4 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden className="size-2 rounded-full bg-indigo-400" />
                Core value
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden className="size-2 rounded-full bg-amber-400" />
                Pattern
              </span>
            </div>
            <ul className="space-y-2.5">
              {ranked.map((item) => (
                <li key={`${item.kind}-${item.name}`}>
                  <div className="mb-1 flex items-baseline justify-between text-sm">
                    <span className="text-zinc-200">{capitalize(item.name)}</span>
                    <span className="font-mono text-xs text-zinc-500">{item.count}×</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-zinc-900">
                    <div
                      className={`h-full rounded-full transition-[width] duration-500 ease-out ${
                        item.kind === "value"
                          ? "bg-gradient-to-r from-indigo-500 to-indigo-300"
                          : "bg-gradient-to-r from-amber-500 to-amber-300"
                      }`}
                      style={{ width: `${Math.max(6, (item.count / rankedMax) * 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {timeline.length > 1 && (
          <div>
            <p className="mb-2 text-xs text-zinc-500">
              Emotional rhythm, oldest to most recent — deeper color means a more recurring feeling.
            </p>
            <div className="flex flex-wrap gap-1" role="img" aria-label="Emotional tone over your recent entries">
              {timeline.map((r, i) => {
                const weight = (toneCount.get(r.tone) ?? 1) / toneMax;
                return (
                  <div
                    key={`${r.date}-${i}`}
                    title={`${capitalize(r.tone)} · ${new Date(r.date).toLocaleDateString()}`}
                    className="h-6 w-3 rounded-sm transition-transform duration-150 hover:scale-110"
                    style={{ backgroundColor: `rgb(129 140 248 / ${0.15 + weight * 0.75})` }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </details>
  );
}
