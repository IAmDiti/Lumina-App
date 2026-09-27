-- Voice Talk usage tracking: one row per transcription request, used only
-- to enforce a daily cap on the free plan (paid is unlimited, same as
-- reflections). Unlike subscriptions/sandbox_attempts, a user inflating
-- their own count here only hurts themselves (hits their own limit
-- sooner), so this follows the same "insert/read own" RLS pattern already
-- used for entries/patterns rather than requiring the service-role client.
create table public.voice_transcriptions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users (id) on delete cascade,
  duration_seconds integer,
  created_at      timestamptz not null default now()
);

create index voice_transcriptions_user_created_idx on public.voice_transcriptions (user_id, created_at desc);

alter table public.voice_transcriptions enable row level security;

create policy "voice_transcriptions: read own" on public.voice_transcriptions
  for select using ((select auth.uid()) = user_id);

create policy "voice_transcriptions: insert own" on public.voice_transcriptions
  for insert with check ((select auth.uid()) = user_id);
