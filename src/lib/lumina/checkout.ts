import "server-only";
import type { BillingInterval } from "./pricing";

/** Builds a Lemon Squeezy hosted checkout URL for the given user and billing interval, or null if unconfigured. */
export function buildCheckoutUrl(userId: string, email: string, interval: BillingInterval): string | null {
  const storeUrl = process.env.LEMONSQUEEZY_STORE_URL;
  const variantId =
    interval === "annual"
      ? process.env.LEMONSQUEEZY_VARIANT_ID_ANNUAL
      : process.env.LEMONSQUEEZY_VARIANT_ID_MONTHLY;
  if (!storeUrl || !variantId) return null;

  const url = new URL(`${storeUrl.replace(/\/$/, "")}/buy/${variantId}`);
  url.searchParams.set("checkout[email]", email);
  url.searchParams.set("checkout[custom][user_id]", userId);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) url.searchParams.set("checkout[redirect_url]", `${siteUrl}/journal?upgraded=1`);

  return url.toString();
}
