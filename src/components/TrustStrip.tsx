import Link from "next/link";
import { Reveal } from "./Reveal";

const POINTS = [
  {
    title: "Yours to take with you",
    body: "Export or permanently delete everything — entries, patterns, account — whenever you ask. Nothing is held hostage.",
  },
  {
    title: "Not therapy, and we say so",
    body: "Lumina is a mirror, not a clinician. If you're in crisis, we point you to a real person, not a chatbot.",
  },
  {
    title: "Encrypted, never sold, never trained on",
    body: "Your words stay yours — encrypted in transit and at rest, never sold, never used to train AI models.",
  },
];

export function TrustStrip() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6" aria-label="Privacy and security">
      <p className="mb-8 text-center text-xs font-medium uppercase tracking-[0.2em] text-indigo-300">
        Worth trusting
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {POINTS.map((p, i) => (
          <Reveal key={p.title} delay={i * 100}>
            <div className="h-full rounded-xl border border-zinc-800 bg-zinc-950/40 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-zinc-900/50">
              <p className="text-sm font-medium text-white">{p.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-5 text-center text-xs text-zinc-500">
        Writing about yourself takes trust.{" "}
        <Link href="/privacy" className="text-zinc-300 hover:text-white">
          Read our full Privacy Policy →
        </Link>
      </p>
    </section>
  );
}
