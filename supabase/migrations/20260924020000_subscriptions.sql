-- Subscriptions: plan + Lemon Squeezy state, one row per user.
--
-- Deliberately has NO insert/update policy for regular users — only the
-- Lemon Squeezy webhook (using the service role key, which bypasses RLS)
-- may write here. This means a signed-in user can never grant themselves
-- a paid plan via a direct REST call to Supabase; the webhook is the only
-- path that can flip `plan` to 'paid'. A user with no row here (e.g. any
-- account created before this migration) is treated as the free plan by
-- the app, so no backfill is required.
create table public.subscriptions (
  user_id                       uuid primary key references public.users (id) on delete cascade,
  plan                          text not null default 'free' check (plan in ('free', 'paid')),
  status                        text,
  lemonsqueezy_customer_id      text,
  lemonsqueezy_subscription_id  text unique,
  renews_at                     timestamptz,
  ends_at                       timestamptz,
  updated_at                    timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "subscriptions: read own" on public.subscriptions
  for select using ((select auth.uid()) = user_id);

create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- Extend the signup trigger to seed a free subscription row alongside the
-- profile and identity board rows it already creates.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, email) values (new.id, coalesce(new.email, ''));
  insert into public.identity_profile (user_id) values (new.id);
  insert into public.subscriptions (user_id) values (new.id);
  return new;
end;
$$;
