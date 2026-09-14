
-- FIX: anonymous visitors were getting 401 on every user_sessions write,
-- silently breaking session/analytics tracking sitewide. Restore intended
-- anonymous session tracking (non-sensitive analytics only). Health data
-- tables remain locked. Upsert (on_conflict=session_id) needs INSERT + UPDATE.
create policy "anon_insert_user_sessions"
  on public.user_sessions for insert
  to anon, authenticated
  with check (true);

create policy "anon_update_user_sessions"
  on public.user_sessions for update
  to anon, authenticated
  using (true)
  with check (true);
