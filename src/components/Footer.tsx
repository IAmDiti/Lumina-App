import Link from "next/link";

const LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/refunds", label: "Refunds" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 text-xs text-zinc-600 sm:flex-row">
        <p>© {new Date().getFullYear()} Lumina</p>
        <nav className="flex items-center gap-5">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-zinc-300">
              {link.label}
            </Link>
          ))}
          <a href="mailto:support@lumina.app" className="transition-colors hover:text-zinc-300">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
