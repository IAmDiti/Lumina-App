import "server-only";

/**
 * Cancels a Lemon Squeezy subscription immediately via their REST API, so a
 * deleted account stops being billed. Returns false (never throws) if the
 * API key isn't configured or the call fails — the caller decides what that
 * means for the deletion flow.
 */
export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) return false;

  try {
    const res = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${apiKey}`,
      },
    });
    if (!res.ok) {
      console.error("[lemonsqueezy] cancel subscription failed", subscriptionId, res.status, await res.text());
    }
    return res.ok;
  } catch (err) {
    console.error("[lemonsqueezy] cancel subscription request failed", subscriptionId, err);
    return false;
  }
}
