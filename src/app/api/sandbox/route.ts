import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { z } from "zod";
import { reflect, ReflectionError } from "@/lib/lumina/engine";
import { createAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 30;

const BodySchema = z.object({
  content: z
    .string()
    .trim()
    .min(3, "Write a little more first.")
    .max(500, "Keep the sandbox entry under 500 characters."),
});

const LIMIT = 1;
const WINDOW_HOURS = 24;

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function hashIp(ip: string) {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

// Public, unauthenticated demo endpoint: journal content itself is never
// persisted — only a hashed IP + timestamp, to rate-limit abuse. Backed by
// the database (not an in-memory counter) so the limit holds regardless of
// process restarts or how many instances the host runs.
export async function POST(request: Request) {
  let admin;
  try {
    admin = createAdminClient();
  } catch (err) {
    console.error("[lumina] sandbox: admin client unavailable", err);
    return error("The sandbox is temporarily unavailable. Please try again later.", 503);
  }

  const ipHash = hashIp(clientIp(request));
  const since = new Date(Date.now() - WINDOW_HOURS * 60 * 60 * 1000).toISOString();

  const { count, error: countError } = await admin
    .from("sandbox_attempts")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);

  if (countError) {
    console.error("[lumina] sandbox rate-limit check failed", countError);
    return error("Something went wrong. Please try again.", 500);
  }
  if ((count ?? 0) >= LIMIT) {
    return error(
      "You've used today's free sandbox reflection — create a free account to keep reflecting.",
      429,
    );
  }

  const parsed = BodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return error(parsed.error.issues[0]?.message ?? "Invalid entry.", 400);

  // Record the attempt before calling the model, so a failed/refused call
  // still counts — otherwise retries could be used to run up API cost
  // without ever tripping the limit.
  const { error: insertError } = await admin.from("sandbox_attempts").insert({ ip_hash: ipHash });
  if (insertError) console.error("[lumina] failed to record sandbox attempt", insertError);

  try {
    const reflection = await reflect(
      parsed.data.content,
      { profile: null, recentEntries: [], activePatterns: [] },
      "free",
    );
    return NextResponse.json({
      response: reflection.active_listener_response,
      insights: reflection.extracted_insights,
    });
  } catch (err) {
    if (err instanceof ReflectionError) return error(err.message, err.status);
    console.error("[lumina] sandbox reflect failed", err);
    return error("Something went wrong. Please try again.", 500);
  }
}
