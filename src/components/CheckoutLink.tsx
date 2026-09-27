"use client";

import { trackEvent } from "@/lib/gtag";
import type { BillingInterval } from "@/lib/lumina/pricing";

/** A real link to Lemon Squeezy's hosted checkout that also fires a GA4 begin_checkout event. */
export function CheckoutLink({
  href,
  interval,
  value,
  className,
  children,
}: {
  href: string;
  interval: BillingInterval;
  value: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={() =>
        trackEvent("begin_checkout", {
          currency: "USD",
          value,
          items: [{ item_id: `lumina_pro_${interval}`, item_name: `Lumina Pro (${interval})`, price: value }],
          // The click immediately navigates to Lemon Squeezy's checkout, so a
          // normal hit can be cancelled mid-flight by the page unload;
          // sendBeacon is designed to survive exactly that.
          transport_type: "beacon",
        })
      }
      className={className}
    >
      {children}
    </a>
  );
}
