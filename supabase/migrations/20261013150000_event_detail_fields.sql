-- FLOWINTOONE EVENT DETAIL PAGE
-- Adds structured content and participation fields used by the public event page.

begin;

alter table public.events
  add column if not exists attendance_mode text not null default 'in_person',
  add column if not exists price_cents integer,
  add column if not exists currency text not null default 'EUR',
  add column if not exists included text,
  add column if not exists features text[] not null default '{}',
  add column if not exists agenda jsonb not null default '[]'::jsonb,
  add column if not exists faq jsonb not null default '[]'::jsonb,
  add column if not exists online_access_info text,
  add column if not exists is_sold_out boolean not null default false,
  add column if not exists is_cancelled boolean not null default false;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.events'::regclass
      and conname = 'flowintoone_events_attendance_mode_check'
  ) then
    alter table public.events
      add constraint flowintoone_events_attendance_mode_check
      check (attendance_mode in ('in_person', 'online')) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.events'::regclass
      and conname = 'flowintoone_events_price_check'
  ) then
    alter table public.events
      add constraint flowintoone_events_price_check
      check (price_cents is null or price_cents >= 0) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.events'::regclass
      and conname = 'flowintoone_events_agenda_array_check'
  ) then
    alter table public.events
      add constraint flowintoone_events_agenda_array_check
      check (jsonb_typeof(agenda) = 'array') not valid;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.events'::regclass
      and conname = 'flowintoone_events_faq_array_check'
  ) then
    alter table public.events
      add constraint flowintoone_events_faq_array_check
      check (jsonb_typeof(faq) = 'array') not valid;
  end if;
end
$$;

-- Keep the event admin usable on projects where the table existed before the
-- authenticated role grants were introduced (Postgres error 42501).
grant usage on schema public to anon, authenticated;
grant select on table public.events to anon, authenticated;
grant insert, update, delete on table public.events to authenticated;

notify pgrst, 'reload schema';

commit;
