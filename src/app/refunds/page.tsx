import type { Metadata } from "next";
import Link from "next/link";
import { LegalHeader } from "@/components/LegalHeader";

export const metadata: Metadata = { title: "Refund Policy" };

const UPDATED = "September 24, 2026";
const CONTACT_EMAIL = "support@luminajournal.app";

function Mail() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className="text-indigo-300 hover:text-indigo-200">
      {CONTACT_EMAIL}
    </a>
  );
}

export default function RefundsPage() {
  return (
    <>
      <LegalHeader />
      <main className="mx-auto w-full max-w-3xl px-4 pb-24 sm:px-6">
        <h1 className="font-serif text-4xl text-zinc-50">Refund Policy</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated {UPDATED}</p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-zinc-300">
          <section>
            <h2 className="font-serif text-xl text-zinc-100">14-day money-back guarantee</h2>
            <p className="mt-3">
              If Lumina&apos;s Paid plan isn&apos;t for you, email <Mail /> within 14 days of your
              first payment and we&apos;ll issue a full refund, no questions asked. (This default
              is easy to change — a shorter or longer window, or a different policy entirely —
              it&apos;s just a starting point.)
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">After the first 14 days</h2>
            <p className="mt-3">
              Renewal charges after the initial 14-day window are generally non-refundable, since
              you&apos;ve had access to the Paid plan for that billing period. If something went
              wrong on our end — a billing error, a duplicate charge, extended downtime — contact
              us and we&apos;ll make it right.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">How refunds are processed</h2>
            <p className="mt-3">
              Subscriptions are billed through <strong className="text-zinc-100">Lemon Squeezy</strong>, our
              merchant of record, and approved refunds are issued back to your original payment
              method through them. Refunds are typically visible on your statement within a few
              business days, depending on your bank or card provider. Separately, Lemon
              Squeezy&apos;s own terms let them issue a refund at their discretion within 60 days
              of a purchase to prevent a card-network chargeback — that&apos;s a safeguard on their
              end, not a way to request a refund outside the window above.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">Chargebacks</h2>
            <p className="mt-3">
              If you dispute a charge directly with your bank or card issuer instead of contacting
              us first, Lemon Squeezy generally resolves it on your behalf and the disputed amount
              is deducted from future payouts to us. We&apos;d rather make it right directly —
              please reach out to <Mail /> before filing a chargeback, since it&apos;s faster for
              you and avoids any confusion with your bank.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">Cancelling vs. refunding</h2>
            <p className="mt-3">
              You can cancel your subscription at any time from your Lemon Squeezy receipt email
              or by asking us — cancelling stops future renewals but doesn&apos;t itself refund
              the current period. If you want the current period refunded too, mention that when
              you contact us.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">Contact</h2>
            <p className="mt-3">
              Refund or billing questions: <Mail />. See also our{" "}
              <Link href="/terms" className="text-indigo-300 hover:text-indigo-200">
                Terms of Service
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
