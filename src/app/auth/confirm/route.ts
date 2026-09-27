import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { ensureProtocol } from "@/lib/url";
import { createClient } from "@/lib/supabase/server";

// Handles Supabase email links (sign-up confirmation, magic links).
// Supports both the token_hash flow and the PKCE `code` flow.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/journal";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/journal";

  const supabase = await createClient();
  let ok = false;

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    ok = !error;
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    ok = !error;
  }

  // Behind Railway's proxy, request.nextUrl's origin can resolve to the
  // container's internal address (e.g. localhost:8080) instead of the
  // public domain — build the redirect from the known public site URL
  // rather than cloning the (potentially wrong) incoming request URL.
  const base = process.env.NEXT_PUBLIC_SITE_URL
    ? ensureProtocol(process.env.NEXT_PUBLIC_SITE_URL)
    : request.nextUrl.origin;
  const target = new URL(ok ? next : "/login", base);
  if (!ok) target.searchParams.set("error", "confirm");
  return NextResponse.redirect(target);
}
