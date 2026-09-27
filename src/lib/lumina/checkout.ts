import "server-only";
import { ensureProtocol } from "@/lib/url";
import type { BillingInterval } from "./pricing";

/**
 * Builds a Lemon Squeezy hosted checkout URL for the given user and billing
 * interval, or null if unconfigured or misconfigured (e.g. a store URL
 * missing its protocol) — a bad env var should never crash the page that
 * renders this, just fall back to "billing isn't configured yet".
 */
export function buildCheckoutUrl(userId: string, email: string, interval: BillingInterval): string | null {
  const storeUrl = process.env.LEMONSQUEEZY_STORE_URL;
  const variantId =
    interval === "annual"
      ? process.env.LEMONSQUEEZY_VARIANT_ID_ANNUAL
      : process.env.LEMONSQUEEZY_VARIANT_ID_MONTHLY;
  if (!storeUrl || !variantId) return null;

  try {
    const url = new URL(`${storeUrl.replace(/\/$/, "")}/checkout/buy/${variantId}`);
    url.searchParams.set("checkout[email]", email);
    url.searchParams.set("checkout[custom][user_id]", userId);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (siteUrl) url.searchParams.set("checkout[redirect_url]", `${ensureProtocol(siteUrl)}/journal?upgraded=1`);

    return url.toString();
  } catch (err) {
    console.error("[lumina] invalid LEMONSQUEEZY_STORE_URL:", storeUrl, err);
    return null;
  }
}
