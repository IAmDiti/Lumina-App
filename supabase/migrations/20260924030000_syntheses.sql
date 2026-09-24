-- Syntheses: periodic, cross-entry reflections (Paid plan only). Unlike
-- subscriptions, a user tampering with their own rows here carries no real
-- risk — it's just content displayed back to them — so this follows the
-- same "insert own" pattern already used for entries/patterns.
create table public.syntheses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users (id) on delete cascade,
  content     text not null,
  entry_count integer not null,
  created_at  timestamptz not null default now()
);

create index syntheses_user_created_idx on public.syntheses (user_id, created_at desc);

alter table public.syntheses enable row level security;

create policy "syntheses: read own" on public.syntheses
  for select using ((select auth.uid()) = user_id);

create policy "syntheses: insert own" on public.syntheses
  for insert with check ((select auth.uid()) = user_id);
