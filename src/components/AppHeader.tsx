import Link from "next/link";
import { signOut } from "@/app/login/actions";
import { Logo } from "./Logo";

const NAV = [
  { href: "/journal", label: "Journal" },
  { href: "/board", label: "Identity Board" },
  { href: "/onboarding", label: "Preferences" },
] as const;

export function AppHeader({ active }: { active: (typeof NAV)[number]["href"] }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/75 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo href="/journal" />
        <nav className="flex items-center gap-1 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active === item.href ? "page" : undefined}
              className="rounded-md px-2.5 py-1.5 text-slate-400 transition-colors hover:text-slate-100 aria-[current=page]:bg-slate-800/70 aria-[current=page]:text-slate-100"
            >
              {item.label}
            </Link>
          ))}
          <form action={signOut}>
            <button
              type="submit"
              className="ml-1 rounded-md px-2.5 py-1.5 text-slate-500 transition-colors hover:text-slate-200"
            >
              Sign out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
