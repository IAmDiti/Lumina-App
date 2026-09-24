import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : undefined;
  const error =
    params.error === "confirm" ? "That confirmation link is invalid or has expired." : undefined;

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="inline-flex">
            <Logo />
          </div>
          <p className="mt-4 font-serif text-lg italic text-zinc-400">
            Write what&apos;s true. See what&apos;s there.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 shadow-2xl shadow-black/60">
          <LoginForm next={next} initialError={error} />
        </div>
        <p className="mt-6 text-center text-xs leading-relaxed text-zinc-500">
          Your entries are private to your account and are sent to an AI model only to generate
          reflections. See our{" "}
          <Link href="/privacy" className="text-zinc-400 hover:text-zinc-200">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="text-zinc-400 hover:text-zinc-200">
            Terms
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
