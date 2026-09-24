import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <div className="mb-8">
        <Logo />
      </div>
      <p className="font-mono text-sm tracking-[0.3em] text-indigo-300/70">404</p>
      <h1 className="mt-3 font-serif text-3xl text-zinc-50 sm:text-4xl">This page went quiet.</h1>
      <p className="mt-3 max-w-sm text-zinc-400">
        Whatever you were looking for isn&apos;t here. Maybe it&apos;s worth reflecting on instead.
      </p>
      <Link
        href="/"
        className="group mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-950/50 transition-all duration-200 hover:bg-indigo-400 hover:shadow-indigo-500/30 active:scale-[0.98]"
      >
        Back home
        <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
          →
        </span>
      </Link>
    </main>
  );
}
