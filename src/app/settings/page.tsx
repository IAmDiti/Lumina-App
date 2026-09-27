import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { DeleteAccountForm } from "@/components/DeleteAccountForm";
import { formatDailyLimit, getPlan, PLAN_LIMITS } from "@/lib/subscription";
import { getUserId } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const { supabase, userId, email } = await getUserId();
  if (!userId) redirect("/login?next=/settings");

  const plan = await getPlan(supabase, userId, email);

  return (
    <>
      <AppHeader active="/settings" plan={plan} />
      <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-serif text-4xl text-zinc-50">Settings</h1>
        <p className="mt-3 mb-10 text-zinc-400">Your account, in one place.</p>

        <section className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">Account</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-zinc-500">Email</dt>
              <dd className="text-zinc-200">{email}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-zinc-500">Plan</dt>
              <dd className="flex items-center gap-2">
                <span
                  className={
                    plan === "paid"
                      ? "rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs text-indigo-200 ring-1 ring-indigo-400/25"
                      : "rounded-full bg-zinc-900/70 px-2.5 py-0.5 text-xs text-zinc-300 ring-1 ring-zinc-700/60"
                  }
                >
                  {plan === "paid" ? "Paid" : "Free"}
                </span>
                {plan === "free" && (
                  <Link href="/upgrade" className="text-xs text-indigo-300 hover:text-indigo-200">
                    Upgrade →
                  </Link>
                )}
              </dd>
            </div>
            {plan === "free" && (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-zinc-500">Daily reflections</dt>
                <dd className="text-zinc-200">{formatDailyLimit(PLAN_LIMITS.free.dailyEntries)}</dd>
              </div>
            )}
          </dl>
          <p className="mt-4 text-xs text-zinc-500">
            Journaling preferences (focus, processing style, tone) live on the{" "}
            <Link href="/onboarding" className="text-zinc-400 hover:text-zinc-200">
              Preferences
            </Link>{" "}
            page. Billing is handled by Lemon Squeezy, our merchant of record.
          </p>
        </section>

        <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">Your data</h2>
          <p className="mt-2 mb-3 text-sm text-zinc-400">
            Every entry, pattern and synthesis Lumina has, as one file.
          </p>
          <a
            href="/api/export"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors duration-150 hover:border-zinc-700 hover:bg-zinc-900/60"
          >
            Download my data (JSON)
          </a>
        </section>

        <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">Danger zone</h2>
          <p className="mt-2 mb-4 text-sm text-zinc-400">
            Download what you need first — deleting your account removes everything and can&apos;t be
            reversed.
          </p>
          <DeleteAccountForm plan={plan} />
        </section>
      </main>
    </>
  );
}
