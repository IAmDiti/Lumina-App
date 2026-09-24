import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { getUserId } from "@/lib/supabase/server";

const PILLARS = [
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
        <Link href="/login" className="text-sm text-zinc-400 transition-colors hover:text-zinc-100">
          Sign in
        </Link>
      </header>

      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-indigo-300/80">
          A journal that listens
        </p>
        <h1 className="font-serif text-4xl leading-tight text-zinc-50 sm:text-6xl">
          Not a diary. Not a chatbot.
          <br />
          <span className="italic text-indigo-200">A mirror.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
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

      <section className="mx-auto grid w-full max-w-5xl gap-4 px-4 pb-20 sm:grid-cols-3 sm:px-6">
        {PILLARS.map((p) => (
          <div
            key={p.title}
            className="group rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-zinc-900/50 hover:shadow-xl hover:shadow-indigo-950/40"
          >
            <h2 className="font-serif text-xl text-zinc-100 transition-colors group-hover:text-white">{p.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{p.body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
