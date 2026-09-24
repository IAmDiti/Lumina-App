import type { Metadata } from "next";
import Link from "next/link";
import { LegalHeader } from "@/components/LegalHeader";

export const metadata: Metadata = { title: "Privacy Policy" };

const UPDATED = "September 24, 2026";
const CONTACT_EMAIL = "support@luminajournal.app";

function Mail() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className="text-indigo-300 hover:text-indigo-200">
      {CONTACT_EMAIL}
    </a>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <LegalHeader />
      <main className="mx-auto w-full max-w-3xl px-4 pb-24 sm:px-6">
        <h1 className="font-serif text-4xl text-zinc-50">Privacy Policy</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated {UPDATED}</p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-zinc-300">
          <p>
            Lumina (&quot;Lumina&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a
            journaling app with an AI &quot;Active Listener&quot; that reflects on what you write.
            This policy explains what personal data we collect, why, how it&apos;s shared with the
            handful of service providers that make Lumina work, how long we keep it, and the
            rights you have over it — including the rights specific to the EU/UK GDPR and the
            California CCPA/CPRA. It applies to lumina&apos;s website, app, and the free sandbox on
            our landing page.
          </p>
          <p>
            This is a good-faith, thorough policy written to match how Lumina actually works — it
            is not a substitute for legal advice. If you need a policy formally vetted for your
            jurisdiction or business structure, have a lawyer review this before relying on it.
          </p>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">1. Who is responsible for your data</h2>
            <p className="mt-3">
              Lumina is operated from North Macedonia. For the personal data described in this
              policy, Lumina is the &quot;data controller&quot; (GDPR terminology) — the entity
              that decides why and how your data is processed. Our payment provider, Lemon
              Squeezy, acts as a <strong className="text-zinc-100">merchant of record</strong> for
              the transaction itself (billing, tax collection, refunds), and separately as our{" "}
              <strong className="text-zinc-100">data processor</strong> under a Data Processing
              Agreement for the billing data it handles on our behalf. Our other providers —
              Supabase and Anthropic — are also processors acting on our instructions, not
              independent controllers of your data.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">2. Information we collect</h2>
            <ul className="mt-3 list-disc space-y-2.5 pl-5">
              <li>
                <strong className="text-zinc-100">Account data:</strong> your email address and
                password. Authentication is handled by our provider, Supabase — we never see or
                store your raw password, only a salted hash it manages.
              </li>
              <li>
                <strong className="text-zinc-100">Journal entries:</strong> the text you write, the
                Active Listener&apos;s replies, and, on the Paid plan, the values, recurring
                patterns, emotional tones, and growth milestones our AI extracts from your entries
                over time (the &quot;Identity Board&quot;) and periodic cross-entry syntheses.
              </li>
              <li>
                <strong className="text-zinc-100">Preferences:</strong> the onboarding choices you
                make about what you&apos;re journaling for, how you process things, and what tone
                you want from Lumina.
              </li>
              <li>
                <strong className="text-zinc-100">Billing data, if you subscribe:</strong> Lemon
                Squeezy collects your payment details (card number, billing address) directly — we
                never receive or store them. We receive only your subscription status, renewal
                dates, and a customer/subscription identifier from them.
              </li>
              <li>
                <strong className="text-zinc-100">Sandbox submissions:</strong> if you try the
                landing-page demo without an account, we process the text you enter to generate a
                one-off reflection, and store a hashed (non-reversible) version of your IP address
                purely to enforce a daily usage limit. The entry text itself is not saved.
              </li>
              <li>
                <strong className="text-zinc-100">Feedback:</strong> if you submit an idea or bug
                report, we store the message, its type, which page you sent it from, and your
                account (if you&apos;re signed in).
              </li>
              <li>
                <strong className="text-zinc-100">Automatically collected technical data:</strong>{" "}
                standard web request data generated by normal hosting — IP address, browser and
                device type, operating system, timestamps, and pages visited — used only for
                security, abuse prevention, and debugging. We do not use this data for advertising
                or behavioral profiling.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">3. How we use your information</h2>
            <p className="mt-3">Depending on the data, we use it to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                Send your journal entries to Anthropic&apos;s Claude API to generate each
                reflection and, on the Paid plan, extract patterns and values for your Identity
                Board and periodic synthesis. Your entries are not used to train Anthropic&apos;s
                models.
              </li>
              <li>Authenticate you and show you your own entries and Identity Board.</li>
              <li>Know which plan you&apos;re on and enforce its daily reflection limit.</li>
              <li>Respond to support requests and feedback you send us.</li>
              <li>Detect abuse, prevent fraud, and keep the service secure.</li>
              <li>Comply with legal obligations, such as responding to a lawful data request.</li>
            </ul>
            <p className="mt-3">
              We do not sell your personal data, and we do not use your journal entries for
              advertising or share them with data brokers.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">4. Legal bases for processing (GDPR/UK GDPR)</h2>
            <p className="mt-3">If you&apos;re in the EEA, UK, or a jurisdiction with similar law, we rely on:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-zinc-100">Contract:</strong> processing your account,
                journal entries, and billing data is necessary to provide the service you signed
                up for.
              </li>
              <li>
                <strong className="text-zinc-100">Legitimate interests:</strong> securing the
                service, preventing abuse of the free sandbox, and improving Lumina based on
                feedback you send us, balanced against your rights.
              </li>
              <li>
                <strong className="text-zinc-100">Consent:</strong> where we ask for it explicitly
                (for example, before sending non-essential email), which you can withdraw at any
                time.
              </li>
              <li>
                <strong className="text-zinc-100">Legal obligation:</strong> where retention or
                disclosure is required by law, such as tax records Lemon Squeezy keeps as merchant
                of record.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">5. Who we share it with</h2>
            <p className="mt-3">
              We share personal data only with the service providers (&quot;sub-processors&quot;)
              needed to run Lumina, each bound by their own data protection terms with us:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-zinc-100">Supabase</strong> — database hosting and
                authentication. Stores your account, entries, and Identity Board data.
              </li>
              <li>
                <strong className="text-zinc-100">Anthropic</strong> — generates the Active
                Listener&apos;s reflections and pattern extraction from the text you submit.
              </li>
              <li>
                <strong className="text-zinc-100">Lemon Squeezy</strong> — billing, as merchant of
                record for subscriptions; handles payment collection, sales tax/VAT compliance, and
                processes refunds on our behalf.
              </li>
              <li>
                <strong className="text-zinc-100">Railway</strong> (or our current hosting
                provider) — runs the application server and processes technical request data as
                described above.
              </li>
            </ul>
            <p className="mt-3">
              We may also disclose data if required by law, subpoena, or other legal process, or to
              protect the rights, property, or safety of Lumina, our users, or the public. If
              Lumina is ever acquired or merges with another company, your data may transfer as
              part of that transaction, subject to this policy&apos;s commitments continuing to
              apply.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">6. International data transfers</h2>
            <p className="mt-3">
              Lumina and its sub-processors operate infrastructure in the United States and other
              countries. If you&apos;re located in the EEA, UK, or another region with data
              transfer restrictions, your data may be transferred to and processed in a country
              that doesn&apos;t have the same data protection laws as yours. Where that happens, we
              and our providers rely on recognized safeguards — such as the European
              Commission&apos;s Standard Contractual Clauses or equivalent mechanisms — to protect
              your data in transit and at rest.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">7. Data retention</h2>
            <p className="mt-3">
              We keep your account, journal entries, and Identity Board data for as long as your
              account is active, so you can keep using the service and building your history. If
              you delete your account (see &quot;Your rights&quot; below), we delete this data
              within 30 days, except where we&apos;re legally required to retain records for
              longer — for example, transaction records Lemon Squeezy keeps for tax purposes.
              Sandbox submissions are never stored beyond generating the one-off response; the IP
              hash used for rate-limiting is automatically superseded after 24 hours. Feedback
              submissions are kept until resolved and reviewed, after which we may retain an
              anonymized record for product history.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">8. Your rights</h2>
            <p className="mt-3">
              You can update your preferences at any time from the Preferences page. Beyond that,
              depending on where you live, you have some or all of the following rights over your
              personal data. To exercise any of them, email <Mail />.
            </p>

            <h3 className="mt-5 text-base font-medium text-zinc-100">If you&apos;re in the EEA, UK, or a similar jurisdiction (GDPR/UK GDPR)</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li><strong className="text-zinc-100">Access</strong> — get a copy of the personal data we hold about you.</li>
              <li><strong className="text-zinc-100">Rectification</strong> — correct inaccurate or incomplete data.</li>
              <li><strong className="text-zinc-100">Erasure</strong> — request deletion of your account and associated data (&quot;right to be forgotten&quot;).</li>
              <li><strong className="text-zinc-100">Restriction</strong> — ask us to limit how we use your data in certain circumstances.</li>
              <li><strong className="text-zinc-100">Portability</strong> — receive your journal entries and Identity Board data in a structured, machine-readable format.</li>
              <li><strong className="text-zinc-100">Objection</strong> — object to processing based on legitimate interests.</li>
              <li><strong className="text-zinc-100">Withdraw consent</strong> — where processing is based on consent, withdraw it at any time without affecting past lawful processing.</li>
              <li><strong className="text-zinc-100">Lodge a complaint</strong> — with your local data protection supervisory authority if you believe we&apos;ve mishandled your data.</li>
            </ul>
            <p className="mt-3">
              As we&apos;re based in North Macedonia, our own supervisory authority is the{" "}
              <strong className="text-zinc-100">Agency for the Protection of Personal Data</strong>{" "}
              (
              <a
                href="https://azlp.mk"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-300 hover:text-indigo-200"
              >
                azlp.mk
              </a>
              ). North Macedonia&apos;s Law on Personal Data Protection is closely aligned with the
              EU GDPR. You can complain to us, to azlp.mk, or to your own country&apos;s authority
              — whichever is easiest for you.
            </p>

            <h3 className="mt-5 text-base font-medium text-zinc-100">If you&apos;re a California resident (CCPA/CPRA)</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li><strong className="text-zinc-100">Right to know</strong> — what personal information we collect, use, and disclose, and why.</li>
              <li><strong className="text-zinc-100">Right to delete</strong> — request deletion of personal information we&apos;ve collected from you.</li>
              <li><strong className="text-zinc-100">Right to correct</strong> — request correction of inaccurate personal information.</li>
              <li>
                <strong className="text-zinc-100">Right to opt out of sale/sharing</strong> — we
                don&apos;t sell or share personal information for cross-context behavioral
                advertising, so there&apos;s nothing to opt out of, but you can still confirm this
                in writing at any time.
              </li>
              <li><strong className="text-zinc-100">Non-discrimination</strong> — we won&apos;t deny you service or charge you differently for exercising these rights.</li>
            </ul>

            <p className="mt-5">
              We&apos;ll verify your identity (typically by confirming the request comes from the
              email on your account) and respond within the timeframe required by applicable law —
              generally 30 days for GDPR/UK GDPR requests and 45 days for CCPA/CPRA requests, with
              a possible extension for complex requests, which we&apos;ll notify you about.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">9. Cookies and similar technologies</h2>
            <p className="mt-3">
              We use one strictly-necessary cookie, set by our authentication provider Supabase, to
              keep you signed in. It&apos;s required for the service to function and isn&apos;t
              covered by cookie-consent requirements, since it isn&apos;t used for tracking,
              analytics, or advertising. We don&apos;t use advertising cookies, cross-site tracking
              pixels, or third-party analytics scripts. Your browser lets you block or delete
              cookies at any time; doing so for the session cookie will sign you out.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">10. Children&apos;s privacy</h2>
            <p className="mt-3">
              Lumina is not directed at, and we do not knowingly collect personal data from,
              anyone under 18. If you believe a child has provided us with personal data, contact
              us at <Mail /> and we&apos;ll delete it.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">11. Security</h2>
            <p className="mt-3">
              Data is encrypted in transit (TLS) and at rest by our infrastructure providers.
              Postgres row-level security ensures only your own authenticated session — and, for
              the minimum necessary processing, the AI and billing services above — can access
              your entries. No method of transmission or storage is 100% secure; if we become
              aware of a data breach affecting your personal data, we&apos;ll notify affected users
              and relevant authorities as required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">12. Changes to this policy</h2>
            <p className="mt-3">
              We may update this policy as Lumina evolves. We&apos;ll update the &quot;Last
              updated&quot; date above, and for material changes, notify you by email or an in-app
              notice before they take effect.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-zinc-100">13. Contact us</h2>
            <p className="mt-3">
              Questions about this policy, or to exercise any of the rights above: <Mail />. See
              also our{" "}
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
