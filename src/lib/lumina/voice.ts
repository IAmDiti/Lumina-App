import "server-only";
export { MAX_RECORDING_SECONDS } from "./voiceConfig";

/** Server-side upload size cap (OpenAI's own limit is 25MB; we cap tighter since 3 minutes of speech never needs that much). */
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

/** Daily transcription requests on the free plan; paid is unlimited, same as reflections. */
export const VOICE_FREE_DAILY_LIMIT = Number(process.env.LUMINA_FREE_DAILY_VOICE_LIMIT ?? 10);
