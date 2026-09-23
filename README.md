# Lumina

A self-reflection journal with an AI **Active Listener**. You write raw thoughts; Lumina answers with a short reflection that ends in one probing question, and keeps a persistent **Identity Board** of your core values, recurring triggers/patterns, emotional tones and growth milestones.

**Stack:** Next.js 16 (App Router, TypeScript) · Tailwind CSS v4 · Supabase (Auth + Postgres + RLS) · Anthropic Claude (`claude-sonnet-5`, structured JSON output)

## Setup

1. **Install**
   ```bash
   npm install
   ```
2. **Create a Supabase project**, then apply the schema, using either:
   - the Supabase CLI: `supabase link --project-ref <ref>` and then `supabase db push`, or
   - the dashboard: paste `supabase/migrations/20260924000000_init.sql` into the SQL editor and run it.
3. **Configure auth** (Dashboard → Authentication → URL Configuration): set the Site URL to your app URL and add `http://localhost:3000/**` to the redirect URLs. Email confirmation can stay on; the confirmation link lands on `/auth/confirm`.
4. **Environment**: copy `.env.example` to `.env.local` and fill in:
   | Variable | Where |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Same page (the legacy `anon` key also works, as `NEXT_PUBLIC_SUPABASE_ANON_KEY`) |
   | `NEXT_PUBLIC_SITE_URL` | Your deployed URL (fallback for email redirects) |
   | `ANTHROPIC_API_KEY` | console.anthropic.com. **Server-only.** |
   | `ANTHROPIC_MODEL` | Optional; defaults to `claude-sonnet-5` |
5. **Run**
   ```bash
   npm run dev
   ```

## How it works

```
Journal (client) ──POST /api/reflect──▶ route handler
                                         ├─ verify session (Supabase getClaims)
                                         ├─ rate limit (5/min, 100/day per user)
                                         ├─ load context: preferences, last 3 entries, active pattern names
                                         ├─ Claude messages.parse() + Zod schema  →  guaranteed JSON shape
                                         └─ rpc record_reflection()  →  one transaction:
                                              insert entry · upsert patterns · bump core values · append milestone
```

- **JSON contract**: `src/lib/lumina/schema.ts` defines the response shape (`active_listener_response` plus `extracted_insights`). It is enforced with Claude structured outputs (`output_config.format`), then trimmed and deduplicated in `engine.ts`.
- **System prompt**: `src/lib/lumina/prompt.ts`. It is static, so it stays cacheable. User preferences, recent entries and known pattern names go in the user message. The known names let Claude reuse them, which keeps pattern counts from fragmenting. Journal text is wrapped in delimiter tags and treated as data, not instructions.
- **Safety**: if an entry indicates self-harm or danger, the prompt switches Claude to a supportive reply that points to crisis resources. A `refusal` stop reason is shown to the user as a gentle message and nothing is saved.
- **Data isolation**: every table has row-level security keyed on `auth.uid()`. `record_reflection` runs as `security invoker`, so RLS applies inside it too. The Anthropic key never reaches the browser.

## Schema

| Table | Columns |
|---|---|
| `users` | `id` (→ `auth.users`), `email`, `onboarding_focus`, `processing_style`, `reflection_tone` |
| `entries` | `id`, `user_id`, `raw_content`, `ai_response`, `emotional_tone`, `created_at` |
| `patterns` | `id`, `user_id`, `pattern_name` (unique per user, case-insensitive), `status` (`active`/`resolved`), `count`, `first_seen_at`, `last_seen_at` |
| `identity_profile` | `id`, `user_id`, `core_values` (JSONB `{value: {count, last_seen_at}}`), `growth_milestones` (text[], last 50) |

A trigger on `auth.users` creates the `users` and `identity_profile` rows at sign-up. A resolved pattern becomes active again if it shows up in a later entry.

## Project layout

```
supabase/migrations/     SQL schema, RLS, record_reflection RPC
src/proxy.ts             session refresh + route gating (Next 16's renamed middleware)
src/lib/supabase/        browser / server / proxy clients
src/lib/lumina/          prompt, JSON schema, Claude engine, onboarding options
src/lib/board.ts         Identity Board data loader
src/app/api/reflect/     the reflection endpoint
src/app/{login,onboarding,journal,board}/
src/components/          header, Identity Board sections
```

## Deploying

Vercel works with no extra configuration. Set the env vars above, and add the production URL to Supabase's redirect URLs. `/api/reflect` sets `maxDuration = 60`.
# Lumina-App
