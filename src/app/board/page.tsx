import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { CoreValues, EmotionalLandscape, Milestones, Patterns } from "@/components/IdentityBoard";
import { loadBoard } from "@/lib/board";
import { getUserId } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Identity Board" };

export default async function BoardPage() {
  const { supabase, userId } = await getUserId();
  if (!userId) redirect("/login");

  const board = await loadBoard(supabase, userId);

  return (
    <>
      <AppHeader active="/board" />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-slate-50">Identity Board</h1>
          <p className="mt-2 text-slate-400">
            A living picture of you, drawn from {board.entryCount}{" "}
            {board.entryCount === 1 ? "entry" : "entries"}.
          </p>
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
