"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-mono text-sm tracking-[0.3em] text-rose-300/70">ERROR</p>
      <h1 className="mt-3 font-serif text-3xl text-zinc-50 sm:text-4xl">Something went wrong.</h1>
      <p className="mt-3 max-w-sm text-zinc-400">
        Lumina hit a snag loading that. Your entries are safe — try again.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-950/50 transition-all duration-200 hover:bg-indigo-400 hover:shadow-indigo-500/30 active:scale-[0.98]"
        >
          Try again
        </button>
        <Link href="/journal" className="text-sm text-zinc-400 transition-colors hover:text-zinc-100">
          Go to journal
        </Link>
      </div>
    </main>
  );
}
