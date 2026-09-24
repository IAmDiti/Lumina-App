import Link from "next/link";
import { Reveal } from "./Reveal";

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

const POINTS = [
  {
    icon: DownloadIcon,
    title: "Yours to take with you",
    body: "Export or permanently delete everything — entries, patterns, account — whenever you ask. Nothing is held hostage.",
  },
  {
    icon: HeartIcon,
    title: "Not therapy, and we say so",
    body: "Lumina is a mirror, not a clinician. If you're in crisis, we point you to a real person, not a chatbot.",
  },
  {
    icon: ShieldIcon,
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
            <div className="group h-full rounded-xl border border-zinc-800 bg-zinc-950/40 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-zinc-900/50">
              <span className="grid size-9 place-items-center rounded-full bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-400/25">
                <p.icon />
              </span>
              <p className="mt-3 text-sm font-medium text-white">{p.title}</p>
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
