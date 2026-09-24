"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "@/app/login/actions";
import { Logo } from "./Logo";
import type { Plan } from "@/lib/subscription";

const ALL_NAV = [
  { href: "/journal", label: "Journal" },
  { href: "/board", label: "Identity Board" },
  { href: "/onboarding", label: "Preferences" },
] as const;

type NavHref = (typeof ALL_NAV)[number]["href"];

export function AppHeader({ active, plan }: { active?: NavHref; plan: Plan }) {
  const [open, setOpen] = useState(false);
  const nav = plan === "paid" ? ALL_NAV : ALL_NAV.filter((item) => item.href !== "/board");

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-900 bg-black/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo href="/journal" />

        <nav className="hidden items-center gap-1 text-sm sm:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active === item.href ? "page" : undefined}
              className="relative rounded-md px-2.5 py-1.5 text-zinc-400 transition-colors duration-150 hover:text-zinc-100 aria-[current=page]:text-zinc-100"
            >
              {item.label}
              {active === item.href && (
                <span
                  aria-hidden
                  className="absolute inset-x-2.5 -bottom-[1px] h-px animate-fade-in bg-indigo-400"
                />
              )}
            </Link>
          ))}
          {plan === "free" && (
            <Link
              href="/upgrade"
              className="ml-1 rounded-md bg-indigo-500/10 px-2.5 py-1.5 text-indigo-300 ring-1 ring-indigo-400/25 transition-colors duration-150 hover:bg-indigo-500/15 hover:text-indigo-200"
            >
              Upgrade
            </Link>
          )}
          <form action={signOut}>
            <button
              type="submit"
              className="ml-1 rounded-md px-2.5 py-1.5 text-zinc-500 transition-colors duration-150 hover:text-zinc-200"
            >
              Sign out
            </button>
          </form>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="grid size-9 shrink-0 place-items-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100 sm:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-5">
            {open ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="animate-fade-in space-y-0.5 border-t border-zinc-900 px-3 py-2 sm:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={active === item.href ? "page" : undefined}
              className="block rounded-md px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100 aria-[current=page]:bg-zinc-900 aria-[current=page]:text-zinc-100"
            >
              {item.label}
            </Link>
          ))}
          {plan === "free" && (
            <Link
              href="/upgrade"
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2.5 text-sm text-indigo-300 transition-colors hover:bg-zinc-900 hover:text-indigo-200"
            >
              Upgrade
            </Link>
          )}
          <form action={signOut}>
            <button
              type="submit"
              className="block w-full rounded-md px-3 py-2.5 text-left text-sm text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-200"
            >
              Sign out
            </button>
          </form>
        </nav>
      )}
    </header>
  );
}
