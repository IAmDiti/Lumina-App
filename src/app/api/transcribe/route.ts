import { NextResponse } from "next/server";
import OpenAI from "openai";
import { MAX_UPLOAD_BYTES, VOICE_FREE_DAILY_LIMIT } from "@/lib/lumina/voice";
import { getPlan } from "@/lib/subscription";
import { getUserId } from "@/lib/supabase/server";

export const maxDuration = 60;

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

let client: OpenAI | null = null;
function getClient() {
  client ??= new OpenAI({ timeout: 60_000, maxRetries: 2 });
  return client;
}

export async function POST(request: Request) {
  const { supabase, userId, email } = await getUserId();
  if (!userId) return error("Please sign in again.", 401);

  const plan = await getPlan(supabase, userId, email);

  if (plan !== "paid") {
    const since = new Date(Date.now() - 86_400_000).toISOString();
    const { count } = await supabase
      .from("voice_transcriptions")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since);
    if ((count ?? 0) >= VOICE_FREE_DAILY_LIMIT) {
      return error(
        `You've used today's ${VOICE_FREE_DAILY_LIMIT} free voice transcriptions. Upgrade for unlimited.`,
        429,
      );
    }
  }

  const formData = await request.formData().catch(() => null);
  const audio = formData?.get("audio");
  if (!audio || !(audio instanceof File)) {
    return error("No audio received.", 400);
  }
  if (audio.size === 0) return error("That recording was empty. Please try again.", 400);
  if (audio.size > MAX_UPLOAD_BYTES) {
    return error("That recording is too long. Please keep it under 3 minutes.", 413);
  }

  let text: string;
  try {
    const result = await getClient().audio.transcriptions.create({
      file: audio,
      model: process.env.OPENAI_TRANSCRIBE_MODEL ?? "gpt-4o-transcribe",
    });
    text = result.text.trim();
  } catch (err) {
    if (err instanceof OpenAI.AuthenticationError) {
      console.error("[lumina] OpenAI authentication failed; check OPENAI_API_KEY");
      return error("Voice Talk is misconfigured. Please try again later.", 500);
    }
    if (err instanceof OpenAI.RateLimitError) {
      return error("Voice Talk is busy right now. Please try again in a moment.", 429);
    }
    console.error("[lumina] transcription failed", err);
    return error("Couldn't transcribe that. Please try again.", 500);
  }

  if (!text) {
    return error("Didn't catch any speech in that recording. Please try again.", 422);
  }

  const { error: dbError } = await supabase.from("voice_transcriptions").insert({ user_id: userId });
  if (dbError) console.error("[lumina] failed to record voice usage", dbError);

  return NextResponse.json({ text });
}
