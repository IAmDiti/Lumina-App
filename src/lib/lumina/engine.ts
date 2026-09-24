import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { z } from "zod";
import { ReflectionSchema, SynthesisSchema, type Reflection } from "./schema";
import {
  SYSTEM_PROMPT,
  SYNTHESIS_SYSTEM_PROMPT,
  buildUserMessage,
  buildSynthesisMessage,
  type ReflectContext,
} from "./prompt";
import type { Entry } from "@/lib/types";
import type { Plan } from "@/lib/subscription";

// The paid plan gets a stronger model and more reasoning effort — the model
// itself is available to anyone via Claude or ChatGPT directly, so the free
// tier stays on the cheaper model; what's worth paying for is memory (see
// subscription.ts) plus a visibly sharper reflection on top of it.
const FREE_MODEL = process.env.ANTHROPIC_MODEL_FREE ?? "claude-sonnet-5";
const PAID_MODEL = process.env.ANTHROPIC_MODEL_PAID ?? "claude-opus-5";
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

/** Calls Claude with a schema and maps SDK errors to user-facing ReflectionErrors. */
async function callClaude<Schema extends z.ZodTypeAny>(opts: {
  model: string;
  effort: "low" | "medium" | "high";
  maxTokens: number;
  system: string;
  userMessage: string;
  schema: Schema;
}): Promise<z.infer<Schema>> {
  let response;
  try {
    response = await getClient().messages.parse({
      model: opts.model,
      max_tokens: opts.maxTokens,
      system: opts.system,
      messages: [{ role: "user", content: opts.userMessage }],
      output_config: {
        effort: opts.effort,
        format: zodOutputFormat(opts.schema),
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
      "Lumina couldn't respond to this. If you're going through something difficult, please reach out to someone you trust or a crisis line (US: call or text 988).",
      422,
    );
  }
  if (response.stop_reason === "max_tokens" || !response.parsed_output) {
    console.error("[lumina] unparseable response, stop_reason:", response.stop_reason);
    throw new ReflectionError("The response came back incomplete. Please try again.", 502);
  }

  return response.parsed_output;
}

/** Calls Claude and returns a schema-validated, normalised reflection. */
export async function reflect(entry: string, ctx: ReflectContext, plan: Plan): Promise<Reflection> {
  const output = await callClaude({
    model: plan === "paid" ? PAID_MODEL : FREE_MODEL,
    effort: plan === "paid" ? "high" : "medium",
    maxTokens: 16000,
    system: SYSTEM_PROMPT,
    userMessage: buildUserMessage(entry, ctx),
    schema: ReflectionSchema,
  });

  return {
    active_listener_response: output.active_listener_response.trim(),
    extracted_insights: {
      detected_patterns: clean(output.extracted_insights.detected_patterns, 120),
      core_values_mentioned: clean(output.extracted_insights.core_values_mentioned, 40).map((v) =>
        v.toLowerCase(),
      ),
      emotional_tone: output.extracted_insights.emotional_tone.trim().toLowerCase().slice(0, 40),
      identity_board_update: output.extracted_insights.identity_board_update.trim().slice(0, 400),
    },
  };
}

/**
 * Reads across many entries at once and surfaces what a single reflection
 * can't: throughlines, tensions, and real movement over time. Paid plan only
 * — always uses the stronger model, regardless of the per-entry plan split.
 */
export async function synthesize(
  entries: Pick<Entry, "raw_content" | "emotional_tone" | "created_at">[],
): Promise<string> {
  const output = await callClaude({
    model: PAID_MODEL,
    effort: "high",
    maxTokens: 4000,
    system: SYNTHESIS_SYSTEM_PROMPT,
    userMessage: buildSynthesisMessage(entries),
    schema: SynthesisSchema,
  });
  return output.synthesis.trim();
}
