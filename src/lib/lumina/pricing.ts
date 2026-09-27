export type BillingInterval = "monthly" | "annual";

// Free trial on both intervals, configured on the Lemon Squeezy side; kept
// here too so the disclosure text and the checkout terms can't drift apart.
export const TRIAL_DAYS = 7;

export const PRICING: Record<BillingInterval, { amount: number; label: string; perMonth: number }> = {
  monthly: { amount: 8.99, label: "$8.99", perMonth: 8.99 },
  annual: { amount: 86.99, label: "$86.99", perMonth: 86.99 / 12 },
};

// Rounded whole-percent savings of annual vs. paying monthly for 12 months.
export const ANNUAL_SAVINGS_PERCENT = Math.round(
  (1 - PRICING.annual.amount / (PRICING.monthly.amount * 12)) * 100,
);
