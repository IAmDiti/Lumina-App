import { NextResponse } from "next/server";
import { z } from "zod";
import { reflect, ReflectionError } from "@/lib/lumina/engine";
import { rateLimit } from "@/lib/rateLimit";

export const maxDuration = 30;

const BodySchema = z.object({
  content: z
    .string()
    .trim()
    .min(3, "Write a little more first.")
    .max(500, "Keep the sandbox entry under 500 characters."),
});

const LIMIT = 5;
const WINDOW_MS = 24 * 60 * 60 * 1000;

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

// Public, unauthenticated demo endpoint: nothing here is persisted to the
// database — it exists purely to let a visitor try the Active Listener
// before creating an account.
export async function POST(request: Request) {
  if (!rateLimit(`sandbox:${clientIp(request)}`, LIMIT, WINDOW_MS)) {
    return error(
      "You've tried the sandbox a few times already today — create a free account to keep reflecting.",
      429,
    );
  }

  const parsed = BodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return error(parsed.error.issues[0]?.message ?? "Invalid entry.", 400);

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
