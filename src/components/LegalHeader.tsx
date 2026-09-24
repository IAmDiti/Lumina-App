import Link from "next/link";
import { Logo } from "./Logo";

export function LegalHeader() {
  return (
    <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-5 sm:px-6">
      <Logo />
      <Link href="/" className="text-sm text-zinc-400 transition-colors hover:text-zinc-100">
        Back to Lumina
      </Link>
    </header>
  );
}
