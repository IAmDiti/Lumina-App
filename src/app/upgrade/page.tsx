import type { Metadata } from "next";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Logo } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { buildCheckoutUrl } from "@/lib/lumina/checkout";
import { ANNUAL_SAVINGS_PERCENT, PRICING, TRIAL_DAYS } from "@/lib/lumina/pricing";
import { PLAN_LIMITS, formatDailyLimit, getPlan } from "@/lib/subscription";
import { getUserId } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Upgrade" };

const FREE_FEATURES = [
  `${formatDailyLimit(PLAN_LIMITS.free.dailyEntries)} reflections a day`,
  "The Active Listener's questions",
  "Your full journal history",
];

const PAID_FEATURES = [
  `${formatDailyLimit(PLAN_LIMITS.paid.dailyEntries)} reflections a day, on a stronger model`,
  "Memory: Lumina recalls recent entries and your patterns",
  "The Identity Board — values, triggers and milestones",
  "Weekly synthesis: throughlines across your whole journal",
];

export default async function UpgradePage({ searchParams }: PageProps<"/upgrade">) {
  const { supabase, userId, email } = await getUserId();
  const params = await searchParams;
  const justUpgraded = params.upgraded === "1";

  const plan = userId ? await getPlan(supabase, userId, email) : null;
  const checkoutUrlMonthly =
    userId && plan !== "paid" ? buildCheckoutUrl(userId, email ?? "", "monthly") : null;
  const checkoutUrlAnnual =
    userId && plan !== "paid" ? buildCheckoutUrl(userId, email ?? "", "annual") : null;
  const trialHref = userId ? null : "/login?next=/upgrade";

  return (
    <>
      {plan ? (
        <AppHeader plan={plan} />
      ) : (
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <Logo />
          <Link href="/login" className="text-sm text-zinc-300 transition-colors hover:text-white">
            Sign in
          </Link>
        </header>
      )}
      <main className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6">
        <Reveal>
          <div className="mb-10 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-300">Plans</p>
            <h1 className="mt-3 font-serif text-4xl text-white">
              {plan === "paid" ? "You're on the Paid plan." : "Give Lumina a memory."}
            </h1>
            {plan !== "paid" && (
              <p className="mt-3 text-zinc-400">
                Unlimited reflections a day, plus the Identity Board.{" "}
                <span className="text-indigo-300">Starts with a {TRIAL_DAYS}-day free trial.</span>
              </p>
            )}
          </div>
        </Reveal>

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
          <Reveal>
            <div className="h-full rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 transition-colors duration-200 hover:border-zinc-700">
              <h2 className="font-serif text-xl text-white">Free</h2>
              <p className="mt-1 text-sm text-zinc-500">No memory between entries.</p>
              <ul className="mt-5 space-y-2.5 text-sm text-zinc-300">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span aria-hidden className="mt-1 size-1.5 shrink-0 rounded-full bg-zinc-600" />
                    {f}
                  </li>
                ))}
              </ul>
              {plan === "free" && (
                <p className="mt-6 rounded-lg bg-zinc-900/70 px-3 py-2 text-center text-xs text-zinc-500">
                  Your current plan
                </p>
              )}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="h-full rounded-2xl border border-indigo-400/30 bg-indigo-500/[0.06] p-6 shadow-xl shadow-indigo-950/40 transition-colors duration-200 hover:border-indigo-400/50">
              <h2 className="font-serif text-xl text-white">Paid</h2>
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
              ) : (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="flex flex-col rounded-xl border border-zinc-800 bg-black/30 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Monthly</p>
                    <p className="mt-2 flex items-baseline gap-1">
                      <span className="font-serif text-2xl text-white">{PRICING.monthly.label}</span>
                      <span className="text-xs text-zinc-500">/mo</span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-zinc-500">after a {TRIAL_DAYS}-day free trial</p>
                    <div className="grow" />
                    {checkoutUrlMonthly ? (
                      <a
                        href={checkoutUrlMonthly}
                        className="mt-4 flex items-center justify-center rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-indigo-400 active:scale-[0.98]"
                      >
                        Start free trial
                      </a>
                    ) : trialHref ? (
                      <Link
                        href={trialHref}
                        className="mt-4 flex items-center justify-center rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-indigo-400 active:scale-[0.98]"
                      >
                        Sign up to start trial
                      </Link>
                    ) : (
                      <p className="mt-4 rounded-lg bg-zinc-900/70 px-2 py-2 text-center text-[11px] text-zinc-500">
                        Not configured yet
                      </p>
                    )}
                  </div>

                  <div className="relative flex flex-col rounded-xl border border-indigo-400/40 bg-indigo-500/10 p-4">
                    <span className="absolute -top-2.5 right-3 rounded-full bg-indigo-500 px-2 py-0.5 text-[10px] font-medium text-white shadow shadow-indigo-950/50">
                      Save {ANNUAL_SAVINGS_PERCENT}%
                    </span>
                    <p className="text-xs font-medium uppercase tracking-wide text-indigo-300">Annual</p>
                    <p className="mt-2 flex items-baseline gap-1">
                      <span className="font-serif text-2xl text-white">{PRICING.annual.label}</span>
                      <span className="text-xs text-zinc-500">/yr</span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-zinc-500">
                      ${PRICING.annual.perMonth.toFixed(2)}/mo, billed yearly after a {TRIAL_DAYS}-day free trial
                    </p>
                    <div className="grow" />
                    {checkoutUrlAnnual ? (
                      <a
                        href={checkoutUrlAnnual}
                        className="mt-3 flex items-center justify-center rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-indigo-400 active:scale-[0.98]"
                      >
                        Start free trial
                      </a>
                    ) : trialHref ? (
                      <Link
                        href={trialHref}
                        className="mt-3 flex items-center justify-center rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-indigo-400 active:scale-[0.98]"
                      >
                        Sign up to start trial
                      </Link>
                    ) : (
                      <p className="mt-3 rounded-lg bg-zinc-900/70 px-2 py-2 text-center text-[11px] text-zinc-500">
                        Not configured yet
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>

        {plan !== "paid" && (checkoutUrlMonthly || checkoutUrlAnnual) && (
          <p className="mt-6 text-center text-xs leading-relaxed text-zinc-600">
            Your {TRIAL_DAYS}-day trial is free — cancel anytime before it ends and you won&apos;t be
            charged. If you don&apos;t cancel, your card is charged automatically when the trial
            ends and the subscription renews each billing period after that. Billed by Lemon
            Squeezy, our merchant of record. By starting a trial you agree to our{" "}
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
          <Link href={userId ? "/journal" : "/"} className="text-zinc-400 transition-colors hover:text-zinc-100">
            {userId ? "← Back to your journal" : "← Back to Lumina"}
          </Link>
        </p>
      </main>
    </>
  );
}
