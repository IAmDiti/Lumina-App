import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { LiveDemo } from "@/components/LiveDemo";
import { Reveal } from "@/components/Reveal";
import { TrustStrip } from "@/components/TrustStrip";
import { getUserId } from "@/lib/supabase/server";

const STEPS = [
  {
    title: "Write raw",
    body: "No prompts, no streaks, no formatting. Just the thought as it is.",
  },
  {
    title: "Get one good question",
    body: "The Active Listener reflects back what it hears and asks the one question worth sitting with.",
  },
  {
    title: "Watch yourself emerge",
    body: "Your Identity Board quietly tracks the values, triggers and emotional patterns that keep showing up.",
  },
];

export default async function Home() {
  const { userId } = await getUserId();
  if (userId) redirect("/journal");

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="animate-drift absolute -top-48 left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[110px]" />
        <div
          className="animate-drift absolute top-1/3 -right-40 size-[28rem] rounded-full bg-indigo-900/25 blur-[110px]"
          style={{ animationDelay: "-8s" }}
        />
      </div>

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
        <Link href="/login" className="text-sm text-zinc-300 transition-colors hover:text-white">
          Sign in
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 pt-12 pb-16 text-center sm:px-6 sm:pt-16">
        <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-indigo-300">
          A journal that listens
        </p>
        <h1 className="font-serif text-4xl leading-tight text-white sm:text-6xl">
          Not a diary. Not a chatbot.
          <br />
          <span className="italic text-indigo-200">A mirror.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-300">
          Lumina reads what you write and responds with a single, probing question, then builds a
          living picture of what you value and what keeps tripping you up.
        </p>
        <Link
          href="/login"
          className="group mt-10 inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-950/60 transition-all duration-200 hover:bg-indigo-400 hover:shadow-indigo-500/30 active:scale-[0.98]"
        >
          Start reflecting
          <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">
        <p className="mb-8 text-center text-xs font-medium uppercase tracking-[0.2em] text-indigo-300">
          How it works
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 120}>
              <div className="h-full rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-zinc-900/50 hover:shadow-xl hover:shadow-indigo-950/40">
                <span className="font-mono text-xs text-indigo-300/70">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-2 font-serif text-xl text-white">{step.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Proof */}
      <Reveal>
        <LiveDemo />
      </Reveal>

      {/* Trust — right before the ask */}
      <Reveal>
        <TrustStrip />
      </Reveal>

      {/* Final CTA */}
      <Reveal>
        <section className="mx-auto w-full max-w-2xl px-4 pb-24 text-center sm:px-6">
          <p className="font-serif text-2xl text-white">Ready to see what&apos;s underneath?</p>
          <Link
            href="/login"
            className="group mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-950/60 transition-all duration-200 hover:bg-indigo-400 hover:shadow-indigo-500/30 active:scale-[0.98]"
          >
            Start reflecting
            <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </section>
      </Reveal>
    </main>
  );
}
