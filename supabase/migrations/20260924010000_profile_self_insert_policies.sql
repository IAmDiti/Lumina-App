-- Accounts created before handle_new_user() existed (or where the trigger
-- otherwise didn't fire) are left without a public.users / identity_profile
-- row. RLS previously only granted UPDATE on these tables, so there was no
-- way for the app to self-heal such an account: an update against a
-- nonexistent row silently affects zero rows instead of erroring, which is
-- why saving onboarding preferences appeared to succeed but never did.
-- These policies let a signed-in user create their own missing row.

create policy "users: insert own" on public.users
  for insert
  with check ((select auth.uid()) = id);

create policy "identity: insert own" on public.identity_profile
  for insert
  with check ((select auth.uid()) = user_id);
