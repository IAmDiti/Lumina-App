import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CoreValues, Pattern } from "@/lib/types";

export type BoardData = {
  values: { name: string; count: number }[];
  activePatterns: Pattern[];
  resolvedPatterns: Pattern[];
  milestones: string[];
  tones: { tone: string; count: number }[];
  recentTones: { tone: string; date: string }[];
  entryCount: number;
};

/** Loads everything the Identity Board shows. RLS scopes every query to the caller. */
export async function loadBoard(supabase: SupabaseClient, userId: string): Promise<BoardData> {
  const [identityRes, patternsRes, tonesRes, countRes] = await Promise.all([
    supabase
      .from("identity_profile")
      .select("core_values, growth_milestones")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("patterns")
      .select("*")
      .order("count", { ascending: false })
      .order("last_seen_at", { ascending: false }),
    supabase
      .from("entries")
      .select("emotional_tone, created_at")
      .not("emotional_tone", "is", null)
      .order("created_at", { ascending: false })
      .limit(60),
    supabase.from("entries").select("id", { count: "exact", head: true }),
  ]);

  const coreValues = (identityRes.data?.core_values ?? {}) as CoreValues;
  const values = Object.entries(coreValues)
    .map(([name, v]) => ({ name, count: v?.count ?? 0 }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const patterns = (patternsRes.data ?? []) as Pattern[];

  const toneRows = (tonesRes.data ?? []) as { emotional_tone: string; created_at: string }[];
  const toneCounts = new Map<string, number>();
  for (const row of toneRows) {
    toneCounts.set(row.emotional_tone, (toneCounts.get(row.emotional_tone) ?? 0) + 1);
  }

  return {
    values,
    activePatterns: patterns.filter((p) => p.status === "active"),
    resolvedPatterns: patterns.filter((p) => p.status === "resolved"),
    milestones: [...((identityRes.data?.growth_milestones as string[] | null) ?? [])].reverse(),
    tones: [...toneCounts.entries()]
      .map(([tone, count]) => ({ tone, count }))
      .sort((a, b) => b.count - a.count),
    recentTones: toneRows.slice(0, 14).map((r) => ({ tone: r.emotional_tone, date: r.created_at })),
    entryCount: countRes.count ?? 0,
  };
}
