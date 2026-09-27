import { Reveal } from "./Reveal";
import { TRIAL_DAYS } from "@/lib/lumina/pricing";
import { PLAN_LIMITS } from "@/lib/subscription";

const QUESTIONS = [
  {
    q: "What exactly is Lumina?",
    a: "A private journal that reads what you write and responds with one honest, probing question — never a summary, never advice, never a streak to protect. Over time it builds an Identity Board: a quiet picture of the values, triggers and emotional patterns that keep showing up in your own words.",
  },
  {
    q: "Is this a replacement for therapy?",
    a: "No. Lumina is a mirror, not a clinician — it reflects back what you've written, it doesn't diagnose or treat anything. If you're in crisis, it points you to a real person, not a chatbot.",
  },
  {
    q: "What's the difference between Free and Paid?",
    a: `Free gives you ${PLAN_LIMITS.free.dailyEntries} reflections a day with no memory between entries. Paid removes the daily limit, remembers everything you've ever written, unlocks the full Identity Board, and periodically synthesizes the patterns across your whole history.`,
  },
  {
    q: "Is there a free trial?",
    a: `Yes — every Paid subscription starts with a ${TRIAL_DAYS}-day free trial. You won't be charged until it ends, and you can cancel anytime before then without paying anything.`,
  },
  {
    q: "Can I cancel, and what happens to my entries?",
    a: "Cancel anytime from your account settings. Your entries are never deleted just because you cancel — you keep read access on Free, and you can export or permanently delete everything yourself whenever you want.",
  },
  {
    q: "Is my data used to train AI models?",
    a: "Never. Your entries are encrypted in transit and at rest, never sold, and never used to train any AI model.",
  },
  {
    q: "Does Voice Talk store my recordings?",
    a: "No. Audio is sent off for transcription and discarded immediately after — only the resulting text lands in your entry, the same as if you'd typed it.",
  },
];

export function FAQ() {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 pb-16 sm:px-6" aria-label="Frequently asked questions">
      <p className="mb-8 text-center text-xs font-medium uppercase tracking-[0.2em] text-indigo-300">
        Questions
      </p>
      <div className="space-y-3">
        {QUESTIONS.map((item, i) => (
          <Reveal key={item.q} delay={i * 60}>
            <details className="group rounded-xl border border-zinc-800 bg-zinc-950/40 transition-colors duration-200 open:border-indigo-400/30 open:bg-zinc-900/40">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-white marker:hidden [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden
                  className="grid size-5 shrink-0 place-items-center text-lg leading-none text-zinc-500 transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="animate-fade-in px-5 pb-4 text-sm leading-relaxed text-zinc-400">{item.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
