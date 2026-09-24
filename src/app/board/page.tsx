import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { CoreValues, EmotionalLandscape, Milestones, Patterns } from "@/components/IdentityBoard";
import { IdentityOverview } from "@/components/IdentityOverview";
import { SynthesisCard } from "@/components/SynthesisCard";
import { loadBoard } from "@/lib/board";
import { getPlan } from "@/lib/subscription";
import { getUserId } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Identity Board" };

export default async function BoardPage() {
  const { supabase, userId, email } = await getUserId();
  if (!userId) redirect("/login");

  const plan = await getPlan(supabase, userId, email);

  if (plan !== "paid") {
    return (
      <>
        <AppHeader active="/board" plan={plan} />
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-300/80">Identity Board</p>
          <h1 className="mt-3 font-serif text-3xl text-zinc-50 sm:text-4xl">This is a Paid feature.</h1>
          <p className="mt-3 max-w-sm text-zinc-400">
            Upgrade to unlock memory: Lumina tracks the values, recurring patterns and growth
            milestones that show up across your entries.
          </p>
          <Link
            href="/upgrade"
            className="group mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-950/50 transition-all duration-200 hover:bg-indigo-400 hover:shadow-indigo-500/30 active:scale-[0.98]"
          >
            Upgrade
            <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </main>
      </>
    );
  }

  const [board, { data: latestSynthesis }] = await Promise.all([
    loadBoard(supabase, userId),
    supabase
      .from("syntheses")
      .select("id, content, entry_count, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return (
    <>
      <AppHeader active="/board" plan={plan} />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-zinc-50">Identity Board</h1>
          <p className="mt-2 text-zinc-400">
            A living picture of you, drawn from {board.entryCount}{" "}
            {board.entryCount === 1 ? "entry" : "entries"}.
          </p>
        </div>
        <div className="mb-5">
          <SynthesisCard initial={latestSynthesis} entryCount={board.entryCount} />
        </div>
        <div className="mb-5">
          <IdentityOverview board={board} />
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-5">
            <CoreValues values={board.values} />
            <EmotionalLandscape tones={board.tones} recent={board.recentTones} />
          </div>
          <div className="space-y-5">
            <Patterns active={board.activePatterns} resolved={board.resolvedPatterns} editable />
            <Milestones milestones={board.milestones} />
          </div>
        </div>
      </main>
    </>
  );
}
