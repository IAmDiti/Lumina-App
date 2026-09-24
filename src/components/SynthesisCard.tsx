"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LocalTime } from "@/components/LocalTime";
import type { Synthesis } from "@/lib/types";

const COOLDOWN_DAYS = 7;
const MIN_ENTRIES = 5;

type SynthesisRow = Pick<Synthesis, "id" | "content" | "entry_count" | "created_at">;

export function SynthesisCard({
  initial,
  entryCount,
}: {
  initial: SynthesisRow | null;
  entryCount: number;
}) {
  const router = useRouter();
  const [synthesis, setSynthesis] = useState(initial);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Date.now() can't be read during render (impure). Default to null — which
  // we treat as "on cooldown" below, the safe state — until the effect
  // resolves the real value just after mount.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
  }, []);

  const nextAvailable = synthesis
    ? new Date(synthesis.created_at).getTime() + COOLDOWN_DAYS * 86_400_000
    : 0;
  const onCooldown = Boolean(synthesis) && (now === null || now < nextAvailable);
  const notEnoughEntries = entryCount < MIN_ENTRIES;

  async function generate() {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/synthesize", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSynthesis(data.synthesis as SynthesisRow);
      router.refresh();
    } catch {
      setError("You appear to be offline. Try again when you're connected.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="rounded-2xl border border-indigo-400/20 bg-indigo-500/[0.05] p-5 transition-colors duration-200 hover:border-indigo-400/30">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-indigo-300/80">Synthesis</h2>
          <p className="mt-1 text-sm text-zinc-500">What only shows up across many entries.</p>
        </div>
        <button
          type="button"
          onClick={() => void generate()}
          disabled={pending || onCooldown || notEnoughEntries}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white transition-all duration-150 hover:bg-indigo-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
        >
          {pending && <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-white" />}
          {pending ? "Reading…" : synthesis ? "New synthesis" : "Generate"}
        </button>
      </header>

      {error && (
        <p
          role="alert"
          className="animate-fade-in mb-3 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-500/20"
        >
          {error}
        </p>
      )}

      {synthesis ? (
        <>
          <p className="animate-fade-in font-serif text-[17px] leading-relaxed text-zinc-200">
            {synthesis.content}
          </p>
          <p className="mt-3 text-xs text-zinc-600">
            <LocalTime iso={synthesis.created_at} /> · from {synthesis.entry_count} entries
            {onCooldown && (
              <>
                {" "}
                · next synthesis available{" "}
                {new Date(nextAvailable).toLocaleDateString("en-US", { timeZone: "UTC" })}
              </>
            )}
          </p>
        </>
      ) : notEnoughEntries ? (
        <p className="text-sm italic text-zinc-500">
          Write at least {MIN_ENTRIES} entries to unlock your first synthesis ({entryCount}/{MIN_ENTRIES}{" "}
          so far).
        </p>
      ) : (
        <p className="text-sm italic text-zinc-500">
          Generate your first synthesis to see the throughlines across your entries.
        </p>
      )}
    </section>
  );
}
