import { NextResponse } from "next/server";
import { getUserId } from "@/lib/supabase/server";

/** Everything Lumina has on the caller, as one JSON file. RLS scopes every query to their own rows. */
export async function GET() {
  const { supabase, userId, email } = await getUserId();
  if (!userId) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  const [entries, patterns, identity, syntheses, voice] = await Promise.all([
    supabase
      .from("entries")
      .select("raw_content, ai_response, emotional_tone, created_at")
      .order("created_at", { ascending: true }),
    supabase.from("patterns").select("pattern_name, status, count, first_seen_at, last_seen_at"),
    supabase.from("identity_profile").select("core_values, growth_milestones").eq("user_id", userId).maybeSingle(),
    supabase.from("syntheses").select("content, entry_count, created_at").order("created_at", { ascending: true }),
    supabase.from("voice_transcriptions").select("duration_seconds, created_at"),
  ]);

  const body = JSON.stringify(
    {
      exported_at: new Date().toISOString(),
      email,
      entries: entries.data ?? [],
      patterns: patterns.data ?? [],
      core_values: identity.data?.core_values ?? {},
      growth_milestones: identity.data?.growth_milestones ?? [],
      syntheses: syntheses.data ?? [],
      voice_transcriptions: voice.data ?? [],
    },
    null,
    2,
  );

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="lumina-export-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
