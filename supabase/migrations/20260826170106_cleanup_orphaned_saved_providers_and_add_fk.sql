-- All 11 rows in saved_providers reference auth.users rows that no longer
-- exist (deleted accounts) — confirmed via left join, 11/11 orphaned, 0 live.
-- Purge them, then add the FK so this can never silently reaccumulate again.
delete from public.saved_providers sp
where not exists (select 1 from auth.users u where u.id = sp.user_id);

alter table public.saved_providers
  add constraint saved_providers_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;
