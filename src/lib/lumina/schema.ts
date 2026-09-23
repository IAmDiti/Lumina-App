import { z } from "zod";

/** The exact JSON contract the Active Listener must return. */
export const ReflectionSchema = z.object({
  active_listener_response: z
    .string()
    .describe("1-2 sentence reflection ending in exactly ONE probing follow-up question."),
  extracted_insights: z.object({
    detected_patterns: z
      .array(z.string())
      .describe("Recurring triggers or emotional patterns identified. Short noun phrases."),
    core_values_mentioned: z
      .array(z.string())
      .describe("Personal values expressed or implied. One or two words each."),
    emotional_tone: z.string().describe("The dominant emotion, one or two words."),
    identity_board_update: z.string().describe("1-sentence growth summary."),
  }),
});

export type Reflection = z.infer<typeof ReflectionSchema>;
