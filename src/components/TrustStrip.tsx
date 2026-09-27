import Link from "next/link";
import { Reveal } from "./Reveal";

type Variant = "plain" | "portable" | "sealed";

const POINTS: { title: string; body: string; variant: Variant }[] = [
  {
    title: "Yours to take with you",
    body: "Export or permanently delete everything — entries, patterns, account — whenever you ask. Nothing is held hostage.",
    variant: "portable",
  },
  {
    title: "Not therapy, and we say so",
    body: "Lumina is a mirror, not a clinician. If you're in crisis, we point you to a real person, not a chatbot.",
    variant: "plain",
  },
  {
    title: "Encrypted, never sold, never trained on",
    body: "Your words stay yours — encrypted in transit and at rest, never sold, never used to train AI models.",
    variant: "sealed",
  },
];

/** Three variations on the Logo's own ring-and-reflection mark, not a generic icon pack. */
function MirrorGlyph({ variant }: { variant: Variant }) {
  return (
    <span
      aria-hidden
      className="mb-4 grid size-11 place-items-center rounded-full bg-indigo-500/10 ring-1 ring-indigo-400/20"
    >
      <svg viewBox="0 0 28 28" className="size-6 overflow-visible" fill="none">
        {variant === "sealed" && (
          <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1" className="text-indigo-400/25" />
        )}
        <circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="1.4" className="text-indigo-300/70" />
        <circle
          cx="14"
          cy="14"
          r="2"
          fill="currentColor"
          className="text-indigo-300"
          style={{ filter: "drop-shadow(0 0 4px rgb(129 140 248 / 0.6))" }}
        />
        {variant === "portable" && (
          <path
            d="M19.5 8.5 L24.5 3.5 M24.5 3.5 H20.5 M24.5 3.5 V7.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-indigo-300/80"
          />
        )}
      </svg>
    </span>
  );
}

export function TrustStrip() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6" aria-label="Privacy and security">
      <p className="mb-8 text-center text-xs font-medium uppercase tracking-[0.2em] text-indigo-300">
        Why this is safe to write in
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {POINTS.map((p, i) => (
          <Reveal key={p.title} delay={i * 100}>
            <div className="h-full rounded-xl border border-zinc-800 bg-zinc-950/40 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-zinc-900/50">
              <MirrorGlyph variant={p.variant} />
              <p className="text-sm font-medium text-white">{p.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={300}>
        <p className="mx-auto mt-8 max-w-lg border-t border-zinc-800/80 pt-6 text-center font-serif text-lg leading-relaxed text-zinc-300 italic">
          Nothing here disappears — and that&apos;s not a risk, it&apos;s the point. You can only watch
          yourself change if the record refuses to flatter you.
        </p>
      </Reveal>

      <p className="mt-5 text-center text-xs text-zinc-500">
        Writing about yourself takes trust.{" "}
        <Link href="/privacy" className="text-zinc-300 hover:text-white">
          Read our full Privacy Policy →
        </Link>
      </p>
    </section>
  );
}
