export type BillingInterval = "monthly" | "annual";

// Free trial on both intervals, configured on the Lemon Squeezy side; kept
// here too so the disclosure text and the checkout terms can't drift apart.
export const TRIAL_DAYS = 7;

export const PRICING: Record<BillingInterval, { amount: number; label: string; perMonth: number }> = {
  monthly: { amount: 4.99, label: "$4.99", perMonth: 4.99 },
  annual: { amount: 47.99, label: "$47.99", perMonth: 47.99 / 12 },
};

// Rounded whole-percent savings of annual vs. paying monthly for 12 months.
export const ANNUAL_SAVINGS_PERCENT = Math.round(
  (1 - PRICING.annual.amount / (PRICING.monthly.amount * 12)) * 100,
);
