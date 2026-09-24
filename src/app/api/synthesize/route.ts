import { NextResponse } from "next/server";
import { getUserId } from "@/lib/supabase/server";
import { getPlan } from "@/lib/subscription";
import { synthesize, ReflectionError } from "@/lib/lumina/engine";

export const maxDuration = 60;

const COOLDOWN_DAYS = 7;
const MIN_ENTRIES = 5;
const MAX_ENTRIES = 60;

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST() {
  const { supabase, userId, email } = await getUserId();
  if (!userId) return error("Please sign in again.", 401);

  const plan = await getPlan(supabase, userId, email);
  if (plan !== "paid") {
    return error("Synthesis is a Paid feature. Upgrade to unlock it.", 403);
  }

  const { data: latest } = await supabase
    .from("syntheses")
    .select("created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latest) {
    const nextAvailable = new Date(latest.created_at).getTime() + COOLDOWN_DAYS * 86_400_000;
    if (Date.now() < nextAvailable) {
      return error(
        `You can generate a new synthesis on ${new Date(nextAvailable).toLocaleDateString()}.`,
        429,
      );
    }
  }

  const { data: entries } = await supabase
    .from("entries")
    .select("raw_content, emotional_tone, created_at")
    .order("created_at", { ascending: false })
    .limit(MAX_ENTRIES);

  if (!entries || entries.length < MIN_ENTRIES) {
    return error(`Write at least ${MIN_ENTRIES} entries to unlock your first synthesis.`, 422);
  }

  let content: string;
  try {
    content = await synthesize(entries);
  } catch (err) {
    if (err instanceof ReflectionError) return error(err.message, err.status);
    console.error("[lumina] synthesize failed", err);
    return error("Something went wrong. Please try again.", 500);
  }

  const { data: saved, error: dbError } = await supabase
    .from("syntheses")
    .insert({ user_id: userId, content, entry_count: entries.length })
    .select("id, content, entry_count, created_at")
    .single();

  if (dbError || !saved) {
    console.error("[lumina] failed to save synthesis", dbError);
    return error("Lumina synthesized, but saving failed. Please try again.", 500);
  }

  return NextResponse.json({ synthesis: saved });
}
