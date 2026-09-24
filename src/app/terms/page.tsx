import type { Metadata } from "next";
import Link from "next/link";
import { LegalHeader } from "@/components/LegalHeader";

export const metadata: Metadata = { title: "Terms of Service" };

const UPDATED = "September 24, 2026";

export default function TermsPage() {
  return (
    <>
      <LegalHeader />
      <main className="mx-auto w-full max-w-3xl px-4 pb-24 sm:px-6">
        <h1 className="font-serif text-4xl text-zinc-50">Terms of Service</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated {UPDATED}</p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-zinc-300">
          <p>
            These terms govern your use of Lumina. By creating an account, you agree to them. This
            is a plain-language starting point, not vetted legal advice — have a lawyer review it
            before relying on it for a real business.
          </p>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">What Lumina is</h2>
            <p className="mt-3">
              Lumina is a journaling app with an AI &quot;Active Listener&quot; that reflects
              questions back at you and, on the Paid plan, tracks patterns across your entries.{" "}
              <strong className="text-zinc-100">
                Lumina is not a therapist, doctor, or crisis service, and nothing it generates is
                medical, psychological, or professional advice.
              </strong>{" "}
              If you&apos;re in crisis, please contact a crisis line (in the US, call or text 988)
              or local emergency services.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">Your account</h2>
            <p className="mt-3">
              You must provide an accurate email and keep your password secure. You&apos;re
              responsible for activity under your account. You must be old enough, under the law
              of your country, to agree to these terms on your own behalf.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">Acceptable use</h2>
            <p className="mt-3">Please don&apos;t use Lumina to:</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>Attempt to disrupt, reverse-engineer, or gain unauthorized access to the service;</li>
              <li>Submit content that is illegal, or that infringes someone else&apos;s rights;</li>
              <li>Resell, sublicense, or provide the service to others as your own product;</li>
              <li>Use the service in a way that violates any applicable law.</li>
            </ul>
            <p className="mt-3">We may suspend or terminate accounts that violate these terms.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">Your content</h2>
            <p className="mt-3">
              You own what you write. We don&apos;t claim ownership of your journal entries, and
              we don&apos;t use them to train third-party AI models. We process your entries only
              to provide the service to you, as described in our{" "}
              <Link href="/privacy" className="text-indigo-300 hover:text-indigo-200">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">Plans, billing &amp; cancellation</h2>
            <p className="mt-3">
              Lumina offers a Free plan and a Paid subscription plan; current pricing and features
              are shown on our{" "}
              <Link href="/upgrade" className="text-indigo-300 hover:text-indigo-200">
                upgrade page
              </Link>
              . Paid subscriptions are billed and processed by{" "}
              <strong className="text-zinc-100">Lemon Squeezy</strong>, our merchant of record —
              your payment relationship for the subscription is with them, and they handle
              payment collection and applicable sales tax/VAT. Subscriptions renew automatically
              each billing period until cancelled. You can cancel at any time; you&apos;ll keep
              Paid access until the end of the period you&apos;ve already paid for, and won&apos;t
              be charged again. See our{" "}
              <Link href="/refunds" className="text-indigo-300 hover:text-indigo-200">
                Refund Policy
              </Link>{" "}
              for refunds.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">Disclaimer &amp; limitation of liability</h2>
            <p className="mt-3">
              Lumina is provided &quot;as is&quot;, without warranties of any kind. AI-generated
              reflections can be wrong or incomplete. To the maximum extent permitted by law, we
              are not liable for indirect, incidental, or consequential damages arising from your
              use of the service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">Termination</h2>
            <p className="mt-3">
              You may stop using Lumina and delete your account at any time by contacting us. We
              may suspend or terminate accounts that violate these terms or our prohibited-use
              rules.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">Changes to these terms</h2>
            <p className="mt-3">
              We may update these terms as the service evolves. We&apos;ll update the date above,
              and for significant changes, notify you by email.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">Contact</h2>
            <p className="mt-3">
              Questions about these terms:{" "}
              <a href="mailto:support@lumina.app" className="text-indigo-300 hover:text-indigo-200">
                support@lumina.app
              </a>
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
