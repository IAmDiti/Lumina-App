import type { Metadata } from "next";
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
          <Logo />
          <p className="mt-4 font-serif text-lg italic text-slate-400">
            Write what&apos;s true. See what&apos;s there.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-2xl shadow-black/40">
          <LoginForm next={next} initialError={error} />
        </div>
        <p className="mt-6 text-center text-xs leading-relaxed text-slate-500">
          Your entries are private to your account and are sent to an AI model only to generate reflections.
        </p>
      </div>
    </main>
  );
}
