export type PatternStatus = "active" | "resolved";

export interface UserProfile {
  id: string;
  email: string;
  onboarding_focus: string | null;
  processing_style: string | null;
  reflection_tone: string | null;
  created_at: string;
}

export interface Entry {
  id: string;
  user_id: string;
  raw_content: string;
  ai_response: string | null;
  emotional_tone: string | null;
  created_at: string;
}

export interface Pattern {
  id: string;
  user_id: string;
  pattern_name: string;
  status: PatternStatus;
  count: number;
  first_seen_at: string;
  last_seen_at: string;
}

export type CoreValues = Record<string, { count: number; last_seen_at: string }>;

export interface IdentityProfile {
  id: string;
  user_id: string;
  core_values: CoreValues;
  growth_milestones: string[];
  updated_at: string;
}
