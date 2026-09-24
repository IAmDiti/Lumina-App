import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

// Subscription statuses Lemon Squeezy reports that should keep the user on
// the paid plan. Anything else (cancelled, expired, unpaid, ...) falls back
// to free.
const ACTIVE_STATUSES = new Set(["active", "on_trial", "past_due"]);

function verifySignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const digest = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const expected = Buffer.from(digest, "utf8");
  const actual = Buffer.from(signature, "utf8");
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

export async function POST(request: Request) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[lemonsqueezy] LEMONSQUEEZY_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook misconfigured" }, { status: 500 });
  }

  const rawBody = await request.text();
  if (!verifySignature(rawBody, request.headers.get("x-signature"), secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const eventName: string | undefined = payload?.meta?.event_name;
  const userId: string | undefined = payload?.meta?.custom_data?.user_id;

  // Only subscription lifecycle events carry the plan-relevant status; a
  // checkout without our custom_data (e.g. a manual test purchase in the
  // dashboard) has nothing to attribute, so it's safely ignored.
  if (!eventName?.startsWith("subscription_") || !userId) {
    return NextResponse.json({ received: true });
  }

  const attrs = payload.data?.attributes ?? {};
  const status: string | undefined = attrs.status;
  const plan = status && ACTIVE_STATUSES.has(status) ? "paid" : "free";

  const admin = createAdminClient();
  const { error } = await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      plan,
      status: status ?? null,
      lemonsqueezy_customer_id: attrs.customer_id != null ? String(attrs.customer_id) : null,
      lemonsqueezy_subscription_id: String(payload.data.id),
      renews_at: attrs.renews_at ?? null,
      ends_at: attrs.ends_at ?? null,
    },
    { onConflict: "user_id" },
  );

  if (error) {
    console.error("[lemonsqueezy] failed to sync subscription", error);
    return NextResponse.json({ error: "Failed to record subscription" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
