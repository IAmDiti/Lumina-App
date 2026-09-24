export type BillingInterval = "monthly" | "annual";

export const PRICING: Record<BillingInterval, { amount: number; label: string; perMonth: number }> = {
  monthly: { amount: 8.99, label: "$8.99", perMonth: 8.99 },
  annual: { amount: 86.99, label: "$86.99", perMonth: 86.99 / 12 },
};

// Rounded whole-percent savings of annual vs. paying monthly for 12 months.
export const ANNUAL_SAVINGS_PERCENT = Math.round(
  (1 - PRICING.annual.amount / (PRICING.monthly.amount * 12)) * 100,
);
