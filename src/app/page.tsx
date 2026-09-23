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
    <main className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
        <Link href="/login" className="text-sm text-slate-400 transition-colors hover:text-slate-100">
          Sign in
        </Link>
      </header>

      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-indigo-300/80">
          A journal that listens
        </p>
        <h1 className="font-serif text-4xl leading-tight text-slate-50 sm:text-6xl">
          Not a diary. Not a chatbot.
          <br />
          <span className="italic text-indigo-200">A mirror.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
          Lumina reads what you write and responds with a single, probing question, then builds a
          living picture of what you value and what keeps tripping you up.
        </p>
        <Link
          href="/login"
          className="mt-10 rounded-lg bg-indigo-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-950/50 transition-colors hover:bg-indigo-400"
        >
          Start reflecting
        </Link>
      </section>

      <section className="mx-auto grid w-full max-w-5xl gap-4 px-4 pb-20 sm:grid-cols-3 sm:px-6">
        {PILLARS.map((p) => (
          <div key={p.title} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="font-serif text-xl text-slate-100">{p.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
