import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { buildCheckoutUrl } from "@/lib/lumina/checkout";
import { PLAN_LIMITS, getPlan } from "@/lib/subscription";
import { getUserId } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Upgrade" };

const FREE_FEATURES = [
  `${PLAN_LIMITS.free.dailyEntries} reflections a day`,
  "The Active Listener's questions",
  "Your full journal history",
];

const PAID_FEATURES = [
  `${PLAN_LIMITS.paid.dailyEntries} reflections a day, on a stronger model`,
  "Memory: Lumina recalls recent entries and your patterns",
  "The Identity Board — values, triggers and milestones",
  "Weekly synthesis: throughlines across your whole journal",
];

export default async function UpgradePage({ searchParams }: PageProps<"/upgrade">) {
  const { supabase, userId, email } = await getUserId();
  if (!userId) redirect("/login?next=/upgrade");

  const params = await searchParams;
  const justUpgraded = params.upgraded === "1";

  const plan = await getPlan(supabase, userId);
  const checkoutUrl = plan === "paid" ? null : buildCheckoutUrl(userId, email ?? "");

  return (
    <>
      <AppHeader plan={plan} />
      <main className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-300/80">Plans</p>
          <h1 className="mt-3 font-serif text-4xl text-zinc-50">
            {plan === "paid" ? "You're on the Paid plan." : "Give Lumina a memory."}
          </h1>
          {plan !== "paid" && (
            <p className="mt-3 text-zinc-400">More reflections a day, plus the Identity Board.</p>
          )}
        </div>

        {justUpgraded && plan !== "paid" && (
          <p
            role="status"
            className="animate-fade-in mb-8 rounded-lg bg-indigo-500/10 px-4 py-3 text-center text-sm text-indigo-200 ring-1 ring-indigo-500/20"
          >
            Payment received — this can take a few seconds to activate. Refresh if your plan doesn&apos;t
            update right away.
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6">
            <h2 className="font-serif text-xl text-zinc-100">Free</h2>
            <p className="mt-1 text-sm text-zinc-500">No memory between entries.</p>
            <ul className="mt-5 space-y-2.5 text-sm text-zinc-300">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span aria-hidden className="mt-1 size-1.5 shrink-0 rounded-full bg-zinc-600" />
                  {f}
                </li>
              ))}
            </ul>
            {plan !== "paid" && (
              <p className="mt-6 rounded-lg bg-zinc-900/70 px-3 py-2 text-center text-xs text-zinc-500">
                Your current plan
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-indigo-400/30 bg-indigo-500/[0.06] p-6 shadow-xl shadow-indigo-950/40">
            <h2 className="font-serif text-xl text-zinc-100">Paid</h2>
            <p className="mt-1 text-sm text-indigo-300/80">Remembers what you write.</p>
            <ul className="mt-5 space-y-2.5 text-sm text-zinc-300">
              {PAID_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span aria-hidden className="mt-1 size-1.5 shrink-0 rounded-full bg-indigo-400" />
                  {f}
                </li>
              ))}
            </ul>

            {plan === "paid" ? (
              <p className="mt-6 rounded-lg bg-indigo-500/10 px-3 py-2 text-center text-xs text-indigo-200 ring-1 ring-indigo-500/20">
                Your current plan
              </p>
            ) : checkoutUrl ? (
              <a
                href={checkoutUrl}
                className="mt-6 flex w-full items-center justify-center rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-950/40 transition-all duration-150 hover:bg-indigo-400 hover:shadow-indigo-500/30 active:scale-[0.98]"
              >
                Upgrade with Lemon Squeezy
              </a>
            ) : (
              <p className="mt-6 rounded-lg bg-zinc-900/70 px-3 py-2 text-center text-xs text-zinc-500">
                Billing isn&apos;t configured yet.
              </p>
            )}
          </div>
        </div>

        {plan !== "paid" && checkoutUrl && (
          <p className="mt-6 text-center text-xs leading-relaxed text-zinc-600">
            Billed by Lemon Squeezy, our merchant of record. Subscriptions renew automatically
            until cancelled. By upgrading you agree to our{" "}
            <Link href="/terms" className="text-zinc-400 hover:text-zinc-200">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/refunds" className="text-zinc-400 hover:text-zinc-200">
              Refund Policy
            </Link>
            .
          </p>
        )}

        <p className="mt-10 text-center text-sm">
          <Link href="/journal" className="text-zinc-400 transition-colors hover:text-zinc-100">
            ← Back to your journal
          </Link>
        </p>
      </main>
    </>
  );
}
