-- Lumina initial schema
-- Tables: users (profile), entries, patterns, identity_profile
-- Every table is protected by row level security scoped to auth.uid().

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.pattern_status as enum ('active', 'resolved');

-- ---------------------------------------------------------------------------
-- users: app-level profile, 1:1 with auth.users
-- ---------------------------------------------------------------------------
create table public.users (
  id                uuid primary key references auth.users (id) on delete cascade,
  email             text not null,
  onboarding_focus  text,
  processing_style  text,
  reflection_tone   text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- entries: one raw journal entry + the Active Listener's reply
-- ---------------------------------------------------------------------------
create table public.entries (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users (id) on delete cascade,
  raw_content     text not null check (char_length(raw_content) between 1 and 10000),
  ai_response     text,
  emotional_tone  text,
  created_at      timestamptz not null default now()
);

create index entries_user_created_idx on public.entries (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- patterns: recurring triggers / emotional patterns detected across entries
-- ---------------------------------------------------------------------------
create table public.patterns (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users (id) on delete cascade,
  pattern_name  text not null check (char_length(pattern_name) between 1 and 120),
  status        public.pattern_status not null default 'active',
  count         integer not null default 1 check (count >= 0),
  first_seen_at timestamptz not null default now(),
  last_seen_at  timestamptz not null default now()
);

-- One row per pattern per user, matched case-insensitively.
create unique index patterns_user_name_key on public.patterns (user_id, lower(pattern_name));
create index patterns_user_status_idx on public.patterns (user_id, status, count desc);

-- ---------------------------------------------------------------------------
-- identity_profile: the persistent Identity Board, 1 row per user
--   core_values: { "<value>": { "count": int, "last_seen_at": timestamptz } }
-- ---------------------------------------------------------------------------
create table public.identity_profile (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null unique references public.users (id) on delete cascade,
  core_values        jsonb not null default '{}'::jsonb,
  growth_milestones  text[] not null default '{}',
  updated_at         timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_set_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

-- Create the profile + empty identity board whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, email) values (new.id, coalesce(new.email, ''));
  insert into public.identity_profile (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.users            enable row level security;
alter table public.entries          enable row level security;
alter table public.patterns         enable row level security;
alter table public.identity_profile enable row level security;

create policy "users: read own"   on public.users for select using ((select auth.uid()) = id);
create policy "users: update own" on public.users for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "entries: read own"   on public.entries for select using ((select auth.uid()) = user_id);
create policy "entries: insert own" on public.entries for insert with check ((select auth.uid()) = user_id);
create policy "entries: delete own" on public.entries for delete using ((select auth.uid()) = user_id);

create policy "patterns: read own"   on public.patterns for select using ((select auth.uid()) = user_id);
create policy "patterns: insert own" on public.patterns for insert with check ((select auth.uid()) = user_id);
create policy "patterns: update own" on public.patterns for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "patterns: delete own" on public.patterns for delete using ((select auth.uid()) = user_id);

create policy "identity: read own"   on public.identity_profile for select using ((select auth.uid()) = user_id);
create policy "identity: update own" on public.identity_profile for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- record_reflection: atomically store an entry and fold its insights into
-- the Identity Board. Runs as the caller (security invoker) so RLS applies.
-- ---------------------------------------------------------------------------
create or replace function public.record_reflection(
  p_raw_content     text,
  p_ai_response     text,
  p_emotional_tone  text,
  p_patterns        text[],
  p_core_values     text[],
  p_milestone       text
)
returns public.entries
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_uid   uuid := auth.uid();
  v_entry public.entries;
  v_name  text;
  v_key   text;
begin
  if v_uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  insert into public.entries (user_id, raw_content, ai_response, emotional_tone)
  values (v_uid, p_raw_content, p_ai_response, nullif(trim(p_emotional_tone), ''))
  returning * into v_entry;

  -- Patterns: bump count, re-activate if it was resolved and has resurfaced.
  foreach v_name in array coalesce(p_patterns, '{}') loop
    v_name := trim(v_name);
    continue when v_name = '';
    insert into public.patterns (user_id, pattern_name)
    values (v_uid, v_name)
    on conflict (user_id, lower(pattern_name)) do update
      set count        = public.patterns.count + 1,
          status       = 'active',
          last_seen_at = now();
  end loop;

  -- Core values: increment per-value counters inside the JSONB map.
  foreach v_name in array coalesce(p_core_values, '{}') loop
    v_key := lower(trim(v_name));
    continue when v_key = '';
    update public.identity_profile ip
       set core_values = ip.core_values || jsonb_build_object(
             v_key,
             jsonb_build_object(
               'count', coalesce((ip.core_values -> v_key ->> 'count')::int, 0) + 1,
               'last_seen_at', now()
             )
           ),
           updated_at = now()
     where ip.user_id = v_uid;
  end loop;

  -- Growth milestones: append, keeping the most recent 50.
  if nullif(trim(p_milestone), '') is not null then
    update public.identity_profile ip
       set growth_milestones = (array_append(ip.growth_milestones, trim(p_milestone)))[
             greatest(1, cardinality(ip.growth_milestones) + 1 - 49) :
           ],
           updated_at = now()
     where ip.user_id = v_uid;
  end if;

  return v_entry;
end;
$$;

grant execute on function public.record_reflection(text, text, text, text[], text[], text) to authenticated;
