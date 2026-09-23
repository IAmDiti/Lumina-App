import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserId } from "@/lib/supabase/server";
import { reflect, ReflectionError } from "@/lib/lumina/engine";
import type { Entry } from "@/lib/types";

export const maxDuration = 60;

const BodySchema = z.object({
  content: z.string().trim().min(3, "Write a little more first.").max(10_000, "That entry is too long (10,000 characters max)."),
});

const PER_MINUTE_LIMIT = 5;
const PER_DAY_LIMIT = Number(process.env.LUMINA_DAILY_ENTRY_LIMIT ?? 100);

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

async function countSince(
  supabase: Awaited<ReturnType<typeof getUserId>>["supabase"],
  ms: number,
) {
  const { count } = await supabase
    .from("entries")
    .select("id", { count: "exact", head: true })
    .gte("created_at", new Date(Date.now() - ms).toISOString());
  return count ?? 0;
}

export async function POST(request: Request) {
  const { supabase, userId } = await getUserId();
  if (!userId) return error("Please sign in again.", 401);

  const parsed = BodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return error(parsed.error.issues[0]?.message ?? "Invalid entry.", 400);
  const content = parsed.data.content;

  const [lastMinute, lastDay] = await Promise.all([
    countSince(supabase, 60_000),
    countSince(supabase, 86_400_000),
  ]);
  if (lastMinute >= PER_MINUTE_LIMIT || lastDay >= PER_DAY_LIMIT) {
    return error("You're writing faster than Lumina can listen. Take a breath and try again shortly.", 429);
  }

  // Context for the Active Listener: preferences, recent thread, known patterns.
  const [profileRes, recentRes, patternsRes] = await Promise.all([
    supabase
      .from("users")
      .select("onboarding_focus, processing_style, reflection_tone")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("entries")
      .select("raw_content, ai_response, created_at")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("patterns")
      .select("pattern_name")
      .eq("status", "active")
      .order("count", { ascending: false })
      .limit(25),
  ]);

  let reflection;
  try {
    reflection = await reflect(content, {
      profile: profileRes.data,
      recentEntries: recentRes.data ?? [],
      activePatterns: (patternsRes.data ?? []).map((p) => p.pattern_name),
    });
  } catch (err) {
    if (err instanceof ReflectionError) return error(err.message, err.status);
    console.error("[lumina] reflect failed", err);
    return error("Something went wrong. Your entry was not saved; please try again.", 500);
  }

  const { active_listener_response, extracted_insights: ins } = reflection;
  const { data: entry, error: dbError } = await supabase
    .rpc("record_reflection", {
      p_raw_content: content,
      p_ai_response: active_listener_response,
      p_emotional_tone: ins.emotional_tone,
      p_patterns: ins.detected_patterns,
      p_core_values: ins.core_values_mentioned,
      p_milestone: ins.identity_board_update,
    })
    .single<Entry>();

  if (dbError || !entry) {
    console.error("[lumina] record_reflection failed", dbError);
    return error("Lumina reflected, but saving failed. Please try again.", 500);
  }

  return NextResponse.json({ entry, insights: ins });
}
