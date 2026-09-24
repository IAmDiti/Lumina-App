-- Sandbox attempts: rate-limits the anonymous landing-page demo by IP.
-- Written only by the sandbox API route's service-role client (bypassing
-- RLS), never by a regular client, so RLS is enabled with no policies —
-- authenticated/anon roles get zero access. This replaces an in-memory
-- limiter, which doesn't survive process restarts or multiple instances;
-- a shared table does, regardless of how many instances are running.
create table public.sandbox_attempts (
  id         uuid primary key default gen_random_uuid(),
  ip_hash    text not null,
  created_at timestamptz not null default now()
);

create index sandbox_attempts_ip_created_idx on public.sandbox_attempts (ip_hash, created_at desc);

alter table public.sandbox_attempts enable row level security;
