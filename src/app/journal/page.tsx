import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { IdentityBoardSummary } from "@/components/IdentityBoard";
import { UpgradeTeaser } from "@/components/UpgradeTeaser";
import { loadBoard } from "@/lib/board";
import { getPlan } from "@/lib/subscription";
import { getUserId } from "@/lib/supabase/server";
import type { Entry } from "@/lib/types";
import { Journal } from "./Journal";

export const metadata: Metadata = { title: "Journal" };

export default async function JournalPage() {
  const { supabase, userId, email } = await getUserId();
  if (!userId) redirect("/login");

  const [{ data: profile }, { data: entries }, plan] = await Promise.all([
    supabase.from("users").select("onboarding_focus").eq("id", userId).maybeSingle(),
    supabase
      .from("entries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30),
    getPlan(supabase, userId, email),
  ]);

  if (!profile?.onboarding_focus) redirect("/onboarding");

  const board = plan === "paid" ? await loadBoard(supabase, userId) : null;

  return (
    <>
      <AppHeader active="/journal" plan={plan} />
      <main className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Journal initialEntries={(entries ?? []) as Entry[]} />
        <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pb-6">
          {board ? <IdentityBoardSummary board={board} /> : <UpgradeTeaser />}
        </aside>
      </main>
    </>
  );
}
