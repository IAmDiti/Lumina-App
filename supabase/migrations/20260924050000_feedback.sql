-- Feedback: "Ideas + Bugs" widget submissions. Open to anonymous visitors as
-- well as signed-in users (a landing-page visitor should be able to report a
-- bug before ever creating an account), so this can't be scoped to "own
-- rows" the way other tables are. Written only by the feedback API route's
-- service-role client — RLS is enabled with no policies, so regular
-- (anon/authenticated) clients get zero direct access, matching the
-- sandbox_attempts pattern.
create table public.feedback (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.users (id) on delete set null,
  type       text not null check (type in ('idea', 'bug')),
  message    text not null check (char_length(message) between 3 and 2000),
  page_url   text,
  created_at timestamptz not null default now()
);

create index feedback_created_idx on public.feedback (created_at desc);

alter table public.feedback enable row level security;
