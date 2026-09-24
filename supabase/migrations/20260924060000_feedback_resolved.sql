-- Lets the admin view mark feedback as handled instead of it accumulating
-- forever with no way to triage it.
alter table public.feedback add column resolved boolean not null default false;
create index feedback_resolved_created_idx on public.feedback (resolved, created_at desc);
