import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { ReflectionSchema, type Reflection } from "./schema";
import { SYSTEM_PROMPT, buildUserMessage, type ReflectContext } from "./prompt";

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5";
const MAX_ITEMS = 5;

let client: Anthropic | null = null;
function getClient() {
  client ??= new Anthropic({ timeout: 60_000, maxRetries: 2 });
  return client;
}

export class ReflectionError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

function clean(list: string[], maxLen: number) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of list) {
    const item = raw.trim().replace(/\s+/g, " ").slice(0, maxLen);
    const key = item.toLowerCase();
    if (!item || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
    if (out.length === MAX_ITEMS) break;
  }
  return out;
}

/** Calls Claude and returns a schema-validated, normalised reflection. */
export async function reflect(entry: string, ctx: ReflectContext): Promise<Reflection> {
  let response;
  try {
    response = await getClient().messages.parse({
      model: MODEL,
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserMessage(entry, ctx) }],
      output_config: {
        effort: "medium",
        format: zodOutputFormat(ReflectionSchema),
      },
    });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      throw new ReflectionError("Lumina is busy right now. Please try again in a moment.", 429);
    }
    if (err instanceof Anthropic.AuthenticationError) {
      console.error("[lumina] Anthropic authentication failed; check ANTHROPIC_API_KEY");
      throw new ReflectionError("The reflection engine is misconfigured.", 500);
    }
    if (err instanceof Anthropic.APIConnectionError) {
      throw new ReflectionError("Couldn't reach the reflection engine. Please try again.", 503);
    }
    if (err instanceof Anthropic.APIError) {
      console.error("[lumina] Anthropic API error", err.status, err.message);
      throw new ReflectionError("The reflection engine had a problem. Please try again.", 502);
    }
    throw err;
  }

  if (response.stop_reason === "refusal") {
    throw new ReflectionError(
      "Lumina couldn't reflect on this entry. If you're going through something difficult, please reach out to someone you trust or a crisis line (US: call or text 988).",
      422,
    );
  }
  if (response.stop_reason === "max_tokens" || !response.parsed_output) {
    console.error("[lumina] unparseable reflection, stop_reason:", response.stop_reason);
    throw new ReflectionError("The reflection came back incomplete. Please try again.", 502);
  }

  const { active_listener_response, extracted_insights: ins } = response.parsed_output;
  return {
    active_listener_response: active_listener_response.trim(),
    extracted_insights: {
      detected_patterns: clean(ins.detected_patterns, 120),
      core_values_mentioned: clean(ins.core_values_mentioned, 40).map((v) => v.toLowerCase()),
      emotional_tone: ins.emotional_tone.trim().toLowerCase().slice(0, 40),
      identity_board_update: ins.identity_board_update.trim().slice(0, 400),
    },
  };
}
