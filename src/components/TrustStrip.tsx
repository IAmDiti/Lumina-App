import Link from "next/link";

const POINTS = [
  {
    title: "Private by default",
    body: "Row-level security means only your account can ever read your entries — not other users, not us browsing a database.",
  },
  {
    title: "Never used to train AI",
    body: "Entries are sent to Anthropic's Claude only to generate your reflection, not to train models.",
  },
  {
    title: "Encrypted, never sold",
    body: "Encrypted in transit and at rest. We don't sell your data or use it for ads.",
  },
];

export function TrustStrip() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6" aria-label="Privacy and security">
      <p className="mb-8 text-center text-xs font-medium uppercase tracking-[0.2em] text-indigo-300">
        Worth trusting
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {POINTS.map((p) => (
          <div key={p.title} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
            <p className="text-sm font-medium text-white">{p.title}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{p.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-center text-xs text-zinc-500">
        Writing about yourself takes trust.{" "}
        <Link href="/privacy" className="text-zinc-300 hover:text-white">
          Read our full Privacy Policy →
        </Link>
      </p>
    </section>
  );
}
