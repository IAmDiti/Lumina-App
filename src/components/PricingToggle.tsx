"use client";

import { useState } from "react";
import { ANNUAL_SAVINGS_PERCENT, PRICING, type BillingInterval } from "@/lib/lumina/pricing";

export function PricingToggle({
  monthlyUrl,
  annualUrl,
}: {
  monthlyUrl: string | null;
  annualUrl: string | null;
}) {
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const price = PRICING[interval];
  const checkoutUrl = interval === "annual" ? annualUrl : monthlyUrl;

  return (
    <div>
      <div className="relative mb-4 grid grid-cols-2 rounded-lg bg-zinc-900/80 p-1 text-xs ring-1 ring-zinc-800">
        <span
          aria-hidden
          className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-md bg-zinc-800 shadow-sm transition-transform duration-200 ease-out ${
            interval === "annual" ? "translate-x-full" : "translate-x-0"
          }`}
        />
        {(["monthly", "annual"] as const).map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setInterval(i)}
            aria-pressed={interval === i}
            className="relative z-10 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-zinc-400 transition-colors duration-150 aria-pressed:text-zinc-100"
          >
            {i === "monthly" ? "Monthly" : "Annual"}
            {i === "annual" && (
              <span className="rounded-full bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-medium text-indigo-300">
                −{ANNUAL_SAVINGS_PERCENT}%
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="font-serif text-3xl text-white">{price.label}</span>
        <span className="text-sm text-zinc-500">/{interval === "annual" ? "year" : "month"}</span>
      </div>
      <p className="mt-1 mb-4 text-xs text-zinc-500">
        {interval === "annual"
          ? `Works out to $${price.perMonth.toFixed(2)}/mo, billed once a year.`
          : "Billed monthly, cancel any time."}
      </p>

      {checkoutUrl ? (
        <a
          href={checkoutUrl}
          className="flex w-full items-center justify-center rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-950/40 transition-all duration-150 hover:bg-indigo-400 hover:shadow-indigo-500/30 active:scale-[0.98]"
        >
          Upgrade with Lemon Squeezy
        </a>
      ) : (
        <p className="rounded-lg bg-zinc-900/70 px-3 py-2 text-center text-xs text-zinc-500">
          Billing isn&apos;t configured yet.
        </p>
      )}
    </div>
  );
}
