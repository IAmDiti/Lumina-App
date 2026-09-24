import Link from "next/link";

/** Compact upsell shown where the Identity Board would be, for free-plan users. */
export function UpgradeTeaser() {
  return (
    <div className="rounded-2xl border border-indigo-400/20 bg-indigo-500/[0.06] p-5 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-indigo-300/80">Identity Board</p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        Upgrade to Paid to unlock memory: Lumina tracks the values, recurring patterns and growth
        milestones that show up across your entries.
      </p>
      <Link
        href="/upgrade"
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-950/40 transition-all duration-150 hover:bg-indigo-400 active:scale-[0.98]"
      >
        Upgrade
      </Link>
    </div>
  );
}
