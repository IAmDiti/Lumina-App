import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LocalTime } from "@/components/LocalTime";
import { isAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserId } from "@/lib/supabase/server";
import { setResolved } from "./actions";

export const metadata: Metadata = { title: "Feedback" };

type Row = {
  id: string;
  type: "idea" | "bug";
  message: string;
  page_url: string | null;
  resolved: boolean;
  created_at: string;
  users: { email: string } | null;
};

export default async function AdminFeedbackPage({ searchParams }: PageProps<"/admin/feedback">) {
  const { userId, email } = await getUserId();
  if (!userId) redirect("/login?next=/admin/feedback");
  if (!isAdmin(email)) redirect("/journal");

  const params = await searchParams;
  const showResolved = params.resolved === "1";

  const admin = createAdminClient();
  const [{ data: rows }, { count: openCount }] = await Promise.all([
    admin
      .from("feedback")
      .select("id, type, message, page_url, resolved, created_at, users(email)")
      .eq("resolved", showResolved)
      .order("created_at", { ascending: false })
      .limit(200)
      .overrideTypes<Row[]>(),
    admin.from("feedback").select("id", { count: "exact", head: true }).eq("resolved", false),
  ]);

  const feedback = rows ?? [];

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-baseline justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white">Feedback</h1>
          <p className="mt-1 text-sm text-zinc-500">{openCount ?? 0} open</p>
        </div>
        <Link href="/journal" className="text-sm text-zinc-400 transition-colors hover:text-white">
          ← Back to app
        </Link>
      </div>

      <div className="mb-5 flex gap-1 text-sm">
        <Link
          href="/admin/feedback"
          aria-current={!showResolved ? "page" : undefined}
          className="rounded-md px-3 py-1.5 text-zinc-400 transition-colors hover:text-white aria-[current=page]:bg-zinc-900 aria-[current=page]:text-white"
        >
          Open
        </Link>
        <Link
          href="/admin/feedback?resolved=1"
          aria-current={showResolved ? "page" : undefined}
          className="rounded-md px-3 py-1.5 text-zinc-400 transition-colors hover:text-white aria-[current=page]:bg-zinc-900 aria-[current=page]:text-white"
        >
          Resolved
        </Link>
      </div>

      {feedback.length === 0 ? (
        <p className="text-sm italic text-zinc-500">Nothing here.</p>
      ) : (
        <ul className="space-y-3">
          {feedback.map((item) => (
            <li key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs ring-1 ${
                    item.type === "bug"
                      ? "bg-rose-500/10 text-rose-300 ring-rose-500/20"
                      : "bg-indigo-500/10 text-indigo-200 ring-indigo-400/25"
                  }`}
                >
                  {item.type === "bug" ? "Bug" : "Idea"}
                </span>
                <form action={setResolved}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="resolved" value={(!item.resolved).toString()} />
                  <button
                    type="submit"
                    className="rounded-md px-2 py-1 text-xs text-zinc-400 ring-1 ring-zinc-700 transition-colors hover:text-zinc-100"
                  >
                    {item.resolved ? "Reopen" : "Mark resolved"}
                  </button>
                </form>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-zinc-200">{item.message}</p>
              <p className="mt-3 text-xs text-zinc-600">
                <LocalTime iso={item.created_at} />
                {item.users?.email ? ` · ${item.users.email}` : " · anonymous"}
                {item.page_url ? ` · ${item.page_url}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
