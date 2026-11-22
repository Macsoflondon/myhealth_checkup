-- Invariant: a row with a scraped turnaround_days must never be flagged "not stated".
create or replace function public.provider_tests_turnaround_consistency()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  -- Discard captured sentence fragments that carry no duration.
  if new.turnaround_raw is not null
     and new.turnaround_raw !~* '(\d|same[\s-]?day|next\s+(working\s+)?day)' then
    new.turnaround_raw := null;
  end if;

  if new.turnaround_days is not null then
    if coalesce(new.turnaround_unit, 'not_stated') = 'not_stated' then
      new.turnaround_unit := case
        when coalesce(new.turnaround_raw, new.turnaround_days_text, '') ~* '(hour|hrs?\M|same[\s-]?day)' then 'hours'
        else 'days' end;
    end if;
    if new.turnaround_hours is null then
      new.turnaround_hours := new.turnaround_days * 24;
    end if;
    new.turnaround_not_stated := false;
  elsif new.turnaround_unit is null then
    new.turnaround_unit := 'not_stated';
  end if;
  return new;
end;
$$;
revoke all on function public.provider_tests_turnaround_consistency() from public, anon, authenticated;

drop trigger if exists trg_provider_tests_turnaround_consistency on public.provider_tests;
create trigger trg_provider_tests_turnaround_consistency
  before insert or update of turnaround_days, turnaround_unit, turnaround_hours, turnaround_raw, turnaround_days_text
  on public.provider_tests
  for each row execute function public.provider_tests_turnaround_consistency();

-- One-off repair of existing rows (fires the trigger).
update public.provider_tests
   set turnaround_days = turnaround_days
 where (turnaround_days is not null and (coalesce(turnaround_unit,'not_stated') = 'not_stated' or turnaround_hours is null or turnaround_not_stated is distinct from false))
    or turnaround_unit is null
    or (turnaround_raw is not null and turnaround_raw !~* '(\d|same[\s-]?day|next\s+(working\s+)?day)');
