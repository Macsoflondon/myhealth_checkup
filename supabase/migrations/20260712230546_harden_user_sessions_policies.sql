
-- Replace the always-true anon policies with scoped ones:
-- anon (auth.uid() null) may only write anonymous rows; authenticated may only write their own.
-- Clears the rls_policy_always_true warning while keeping anonymous session tracking working.
drop policy if exists "anon_insert_user_sessions" on public.user_sessions;
drop policy if exists "anon_update_user_sessions" on public.user_sessions;

create policy "anon_insert_user_sessions" on public.user_sessions
  for insert to anon, authenticated
  with check (user_id is null or user_id = (select auth.uid()));

create policy "anon_update_user_sessions" on public.user_sessions
  for update to anon, authenticated
  using (user_id is null or user_id = (select auth.uid()))
  with check (user_id is null or user_id = (select auth.uid()));
