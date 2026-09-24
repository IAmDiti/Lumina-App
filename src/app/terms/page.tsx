import type { Metadata } from "next";
import Link from "next/link";
import { LegalHeader } from "@/components/LegalHeader";

export const metadata: Metadata = { title: "Terms of Service" };

const UPDATED = "September 24, 2026";
const CONTACT_EMAIL = "support@luminajournal.app";

function Mail() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className="text-indigo-300 hover:text-indigo-200">
      {CONTACT_EMAIL}
    </a>
  );
}

export default function TermsPage() {
  return (
    <>
      <LegalHeader />
      <main className="mx-auto w-full max-w-3xl px-4 pb-24 sm:px-6">
        <h1 className="font-serif text-4xl text-zinc-50">Terms of Service</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated {UPDATED}</p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-zinc-300">
          <p>
            These Terms of Service (&quot;Terms&quot;) are a contract between you and Lumina
            (&quot;Lumina&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;), operated from
            North Macedonia, governing your use of the Lumina website and app (the
            &quot;Service&quot;). By creating an account or otherwise using the Service, you agree
            to these Terms. This is a thorough, plain-language starting point, not vetted legal
            advice — have a lawyer review it before relying on it for a real business.
          </p>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">1. What Lumina is</h2>
            <p className="mt-3">
              Lumina is a journaling app with an AI &quot;Active Listener&quot; that reflects
              questions back at you and, on the Paid plan, tracks patterns across your entries and
              periodically synthesizes them.{" "}
              <strong className="text-zinc-100">
                Lumina is not a therapist, doctor, counselor, or crisis service, and nothing it
                generates is medical, psychological, financial, or professional advice.
              </strong>{" "}
              AI-generated reflections can be incomplete, generic, or simply wrong. If you&apos;re
              in crisis or thinking about harming yourself, please contact a crisis line (in the
              US, call or text 988) or local emergency services — not Lumina.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">2. Eligibility</h2>
            <p className="mt-3">
              You must be at least 18 years old, and have the legal capacity to enter into a
              binding contract in your jurisdiction, to create a Lumina account. By using the
              Service, you represent that you meet these requirements. If we learn an account
              belongs to someone who doesn&apos;t, we may suspend or terminate it.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">3. Your account</h2>
            <p className="mt-3">
              You must provide an accurate email address and keep your password confidential.
              You&apos;re responsible for all activity under your account, and for notifying us at{" "}
              <Mail /> if you suspect unauthorized access. We use reasonable technical safeguards
              to protect your account, but we&apos;re not liable for losses caused by your failure
              to keep your credentials secure.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">4. Acceptable use</h2>
            <p className="mt-3">You agree not to:</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>Attempt to disrupt, overload, reverse-engineer, or gain unauthorized access to the Service or its underlying systems;</li>
              <li>Submit content that is illegal, or that infringes someone else&apos;s intellectual property or privacy rights;</li>
              <li>Use the Service to generate or store content that violates applicable law, including harassment, threats, or content exploiting minors;</li>
              <li>Attempt to circumvent usage limits, for example by abusing the anonymous sandbox demo;</li>
              <li>Resell, sublicense, or provide the Service to others as your own product;</li>
              <li>Use any automated system (bot, scraper) to access the Service outside of its intended use;</li>
              <li>Use the Service in a way that violates any applicable law or regulation.</li>
            </ul>
            <p className="mt-3">
              We may investigate, and suspend or terminate accounts that violate this section,
              with or without notice, depending on severity.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">5. Your content</h2>
            <p className="mt-3">
              You own what you write. Between you and us, you retain all rights to your journal
              entries. By submitting an entry, you grant us a limited, worldwide license to
              process, store, and transmit it solely to provide the Service to you — including
              sending it to Anthropic&apos;s API to generate a reflection. We don&apos;t use your
              entries to train third-party AI models, and we don&apos;t use them for any purpose
              beyond providing and improving the Service, as described in our{" "}
              <Link href="/privacy" className="text-indigo-300 hover:text-indigo-200">
                Privacy Policy
              </Link>
              . This license ends when you delete the relevant content or your account, except
              where a copy persists briefly in backups pending routine deletion.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">6. Our intellectual property</h2>
            <p className="mt-3">
              The Service — including the Lumina name and logo, its design, the Active Listener
              system prompts, and the underlying software — is owned by us or our licensors and
              protected by intellectual property law. These Terms don&apos;t grant you any right to
              use our branding, and you may not copy, modify, or create derivative works of the
              Service except as necessary to use it normally.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">7. Plans, billing &amp; Lemon Squeezy</h2>
            <p className="mt-3">
              Lumina offers a Free plan and a Paid subscription plan; current features are shown on
              our{" "}
              <Link href="/upgrade" className="text-indigo-300 hover:text-indigo-200">
                upgrade page
              </Link>
              . Paid subscriptions are billed and processed by{" "}
              <strong className="text-zinc-100">Lemon Squeezy</strong>, acting as merchant of
              record. That means your payment relationship for the subscription is directly with
              Lemon Squeezy, not us — they collect payment, calculate and remit applicable sales
              tax/VAT/GST, appear on your card statement, and handle chargebacks. Subscriptions
              renew automatically each billing period at the then-current price until cancelled.
              You can cancel at any time from your Lemon Squeezy receipt email or by contacting us;
              you&apos;ll keep Paid access until the end of the period you&apos;ve already paid
              for, and won&apos;t be charged again. See our{" "}
              <Link href="/refunds" className="text-indigo-300 hover:text-indigo-200">
                Refund Policy
              </Link>{" "}
              for how refunds work.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">8. Disclaimer of warranties</h2>
            <p className="mt-3">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;, WITHOUT
              WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE, AND NON-INFRINGEMENT. We don&apos;t warrant that the Service will
              be uninterrupted, error-free, or that AI-generated reflections will be accurate,
              complete, or suitable for your situation. You use the Service, and rely on its
              output, at your own discretion.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">9. Limitation of liability</h2>
            <p className="mt-3">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, LUMINA AND ITS OPERATORS WILL NOT BE LIABLE
              FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY
              LOSS OF DATA, PROFITS, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE, EVEN IF
              WE&apos;VE BEEN ADVISED OF THE POSSIBILITY. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING
              FROM THESE TERMS OR THE SERVICE WILL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU
              PAID US IN THE 12 MONTHS BEFORE THE CLAIM, OR (B) USD $50. Some jurisdictions
              don&apos;t allow these limitations, so some of them may not apply to you.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">10. Indemnification</h2>
            <p className="mt-3">
              You agree to defend, indemnify, and hold us harmless from any claim, liability, or
              expense (including reasonable legal fees) arising from your misuse of the Service,
              your content, or your violation of these Terms or applicable law.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">11. Termination</h2>
            <p className="mt-3">
              You may stop using Lumina and delete your account at any time by contacting us at{" "}
              <Mail />. We may suspend or terminate your access, with or without notice, if you
              violate these Terms, if required by law, or if we discontinue the Service. Sections
              that by their nature should survive termination (ownership, disclaimers, liability
              limits, indemnification, governing law) will continue to apply.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">12. Third-party services</h2>
            <p className="mt-3">
              The Service relies on third-party providers — Anthropic for AI reflections, Supabase
              for data storage and authentication, and Lemon Squeezy for billing. We&apos;re not
              responsible for outages, errors, or changes in those providers&apos; own services
              that affect Lumina&apos;s availability or output.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">13. Changes to these Terms</h2>
            <p className="mt-3">
              We may update these Terms as the Service evolves. We&apos;ll update the date above,
              and for material changes, notify you by email or an in-app notice before they take
              effect. Continuing to use the Service after changes take effect means you accept
              them.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">14. Governing law &amp; disputes</h2>
            <p className="mt-3">
              These Terms are governed by the laws of North Macedonia, without regard to
              conflict-of-law principles. Any dispute arising from these Terms or the Service that
              isn&apos;t resolved informally will be brought exclusively in the competent courts of
              Skopje, North Macedonia. If you&apos;re a consumer in the EU or another jurisdiction
              whose law gives you the right to bring a claim in your own country&apos;s courts
              regardless of this clause, that mandatory right isn&apos;t affected by this section.
              Before any formal dispute, you agree to first contact us at <Mail /> so we can try to
              resolve it informally.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">15. Miscellaneous</h2>
            <p className="mt-3">
              If any part of these Terms is found unenforceable, the rest remains in effect. Our
              failure to enforce a provision isn&apos;t a waiver of it. You may not assign these
              Terms without our consent; we may assign them in connection with a merger,
              acquisition, or sale of assets. These Terms, together with our{" "}
              <Link href="/privacy" className="text-indigo-300 hover:text-indigo-200">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/refunds" className="text-indigo-300 hover:text-indigo-200">
                Refund Policy
              </Link>
              , are the entire agreement between you and us regarding the Service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">16. Contact</h2>
            <p className="mt-3">Questions about these Terms: <Mail /></p>
          </section>
        </div>
      </main>
    </>
  );
}
