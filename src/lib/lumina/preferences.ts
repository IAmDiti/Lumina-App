// Onboarding options. `prompt` is what the Active Listener is told; `label` and
// `hint` are what the user sees. Keys are what we store in public.users.

type Option = { label: string; hint: string; prompt: string };

export const FOCUS_OPTIONS = {
  emotions: {
    label: "Understanding my emotions",
    hint: "Name what I feel and why",
    prompt: "understanding their emotions and where they come from",
  },
  decisions: {
    label: "Working through a decision",
    hint: "Untangle a choice I'm facing",
    prompt: "working through decisions and what is really at stake in them",
  },
  relationships: {
    label: "Relationships",
    hint: "How I show up with others",
    prompt: "their relationships and how they show up with other people",
  },
  purpose: {
    label: "Career & purpose",
    hint: "What I want my work to mean",
    prompt: "their work, ambitions and sense of purpose",
  },
  stress: {
    label: "Stress & overwhelm",
    hint: "Find what's underneath the pressure",
    prompt: "stress, overwhelm and what sits underneath the pressure",
  },
  self_awareness: {
    label: "General self-awareness",
    hint: "See myself more clearly",
    prompt: "general self-awareness and noticing their own patterns",
  },
} satisfies Record<string, Option>;

export const STYLE_OPTIONS = {
  verbal: {
    label: "I think by writing",
    hint: "Stream of consciousness, figure it out as I go",
    prompt: "thinks by writing freely; entries may wander, so help them find the thread",
  },
  analytical: {
    label: "Analytical",
    hint: "I like structure and cause-and-effect",
    prompt: "processes analytically; reflect structure back and probe causes and assumptions",
  },
  emotional: {
    label: "Feelings first",
    hint: "I start from how something felt",
    prompt: "starts from feelings; stay close to the emotion before moving to meaning",
  },
  big_picture: {
    label: "Big picture",
    hint: "I connect things to the larger story",
    prompt: "thinks in big-picture narratives; connect moments to their larger story",
  },
} satisfies Record<string, Option>;

export const TONE_OPTIONS = {
  gentle: {
    label: "Gentle",
    hint: "Warm, patient, no pressure",
    prompt: "gentle and warm; never pushy",
  },
  curious: {
    label: "Curious",
    hint: "Open questions, no judgment",
    prompt: "curious and open, like a thoughtful friend",
  },
  direct: {
    label: "Direct",
    hint: "Plain-spoken, gets to the point",
    prompt: "direct and plain-spoken; skip softening language",
  },
  challenging: {
    label: "Challenging",
    hint: "Push back on my stories",
    prompt: "respectfully challenging; name contradictions and question the story they tell themselves",
  },
} satisfies Record<string, Option>;

export type FocusKey = keyof typeof FOCUS_OPTIONS;
export type StyleKey = keyof typeof STYLE_OPTIONS;
export type ToneKey = keyof typeof TONE_OPTIONS;

export function isKeyOf<T extends object>(obj: T, key: unknown): key is keyof T {
  return typeof key === "string" && Object.hasOwn(obj, key);
}
