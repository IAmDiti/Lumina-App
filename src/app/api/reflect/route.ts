import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserId } from "@/lib/supabase/server";
import { reflect, ReflectionError } from "@/lib/lumina/engine";
import { formatDailyLimit, getPlan, PLAN_LIMITS } from "@/lib/subscription";
import type { CoreValues, Entry } from "@/lib/types";

export const maxDuration = 60;

const BodySchema = z.object({
  content: z.string().trim().min(3, "Write a little more first.").max(10_000, "That entry is too long (10,000 characters max)."),
});

const PER_MINUTE_LIMIT = 5;

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
  const { supabase, userId, email } = await getUserId();
  if (!userId) return error("Please sign in again.", 401);

  const parsed = BodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return error(parsed.error.issues[0]?.message ?? "Invalid entry.", 400);
  const content = parsed.data.content;

  const plan = await getPlan(supabase, userId, email);
  const { dailyEntries: perDayLimit, memory } = PLAN_LIMITS[plan];

  const [lastMinute, lastDay] = await Promise.all([
    countSince(supabase, 60_000),
    countSince(supabase, 86_400_000),
  ]);
  if (lastMinute >= PER_MINUTE_LIMIT) {
    return error("You're writing faster than Lumina can listen. Take a breath and try again shortly.", 429);
  }
  if (lastDay >= perDayLimit) {
    return error(
      plan === "free"
        ? `You've used today's ${perDayLimit} free reflections. Upgrade for ${formatDailyLimit(PLAN_LIMITS.paid.dailyEntries).toLowerCase()} reflections a day.`
        : "You've reached today's reflection limit. Try again tomorrow.",
      429,
    );
  }

  // Context for the Active Listener: preferences always; recent thread,
  // known patterns, core values, growth history and the last synthesis
  // ("memory") only on the paid plan.
  const [profileRes, recentRes, patternsRes, identityRes, synthesisRes] = await Promise.all([
    supabase
      .from("users")
      .select("onboarding_focus, processing_style, reflection_tone")
      .eq("id", userId)
      .maybeSingle(),
    memory
      ? supabase
          .from("entries")
          .select("raw_content, ai_response, created_at")
          .order("created_at", { ascending: false })
          .limit(3)
      : Promise.resolve({ data: [] }),
    memory
      ? supabase
          .from("patterns")
          .select("pattern_name")
          .eq("status", "active")
          .order("count", { ascending: false })
          .limit(25)
      : Promise.resolve({ data: [] }),
    memory
      ? supabase.from("identity_profile").select("core_values, growth_milestones").eq("user_id", userId).maybeSingle()
      : Promise.resolve({ data: null }),
    memory
      ? supabase.from("syntheses").select("content, created_at").order("created_at", { ascending: false }).limit(1).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const coreValues = (identityRes.data?.core_values ?? {}) as CoreValues;

  let reflection;
  try {
    reflection = await reflect(
      content,
      {
        profile: profileRes.data,
        recentEntries: recentRes.data ?? [],
        activePatterns: (patternsRes.data ?? []).map((p: { pattern_name: string }) => p.pattern_name),
        coreValues: Object.entries(coreValues).map(([name, v]) => ({
          name,
          count: v.count,
          last_seen_at: v.last_seen_at,
        })),
        growthMilestones: (identityRes.data?.growth_milestones as string[] | null) ?? [],
        latestSynthesis: synthesisRes.data ?? null,
      },
      plan,
    );
  } catch (err) {
    if (err instanceof ReflectionError) return error(err.message, err.status);
    console.error("[lumina] reflect failed", err);
    return error("Something went wrong. Your entry was not saved; please try again.", 500);
  }

  const { active_listener_response, extracted_insights: ins } = reflection;
  // Free plan has no memory: never persist pattern/value/milestone extraction,
  // even if the model returned some — only the entry itself is saved.
  const { data: entry, error: dbError } = await supabase
    .rpc("record_reflection", {
      p_raw_content: content,
      p_ai_response: active_listener_response,
      p_emotional_tone: ins.emotional_tone,
      p_patterns: memory ? ins.detected_patterns : [],
      p_core_values: memory ? ins.core_values_mentioned : [],
      p_milestone: memory ? ins.identity_board_update : null,
    })
    .single<Entry>();

  if (dbError || !entry) {
    console.error("[lumina] record_reflection failed", dbError);
    return error("Lumina reflected, but saving failed. Please try again.", 500);
  }

  return NextResponse.json({ entry, insights: memory ? ins : null });
}
