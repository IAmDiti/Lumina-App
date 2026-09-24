import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5">
      <span
        aria-hidden
        className="relative grid size-7 place-items-center rounded-full bg-indigo-500/15 ring-1 ring-indigo-400/40 transition-transform duration-300 ease-out group-hover:scale-110"
      >
        <span className="animate-pulse-ring size-2.5 rounded-full bg-indigo-300 shadow-[0_0_14px_4px_rgb(129_140_248/0.55)] transition-shadow group-hover:shadow-[0_0_18px_6px_rgb(129_140_248/0.7)]" />
      </span>
      <span className="font-serif text-xl tracking-tight text-zinc-100">Lumina</span>
    </Link>
  );
}
