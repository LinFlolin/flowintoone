-- FLOWINTOONE EVENTS ADMIN
-- Idempotently provisions the events table, owner policies, and public reads.
-- Review and apply this migration in Supabase before enabling the admin UI.

begin;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references auth.users(id) on delete cascade,
  title text not null,
  slug text not null,
  description text,
  short_description text,
  type text not null,
  category text,
  start_at timestamptz not null,
  end_at timestamptz,
  city text,
  location_name text,
  address text,
  external_url text,
  image_url text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep installations created from an earlier table definition compatible.
alter table public.events add column if not exists created_by uuid references auth.users(id) on delete cascade;
alter table public.events add column if not exists short_description text;
alter table public.events add column if not exists category text;
alter table public.events add column if not exists image_url text;
alter table public.events add column if not exists updated_at timestamptz not null default now();

create unique index if not exists flowintoone_events_slug_unique
  on public.events (lower(slug));
create index if not exists flowintoone_events_owner_idx
  on public.events (created_by, start_at);
create index if not exists flowintoone_events_public_idx
  on public.events (start_at)
  where status = 'published';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.events'::regclass
      and conname = 'flowintoone_events_status_check'
  ) then
    alter table public.events
      add constraint flowintoone_events_status_check
      check (status in ('draft', 'published')) not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.events'::regclass
      and conname = 'flowintoone_events_dates_check'
  ) then
    alter table public.events
      add constraint flowintoone_events_dates_check
      check (end_at is null or end_at >= start_at) not valid;
  end if;
end
$$;

create or replace function public.flowintoone_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists flowintoone_events_set_updated_at on public.events;
create trigger flowintoone_events_set_updated_at
before update on public.events
for each row execute function public.flowintoone_set_updated_at();

alter table public.events enable row level security;

drop policy if exists "flowintoone_events_public_read" on public.events;
create policy "flowintoone_events_public_read"
on public.events
for select
to anon
using (status = 'published');

drop policy if exists "flowintoone_events_authenticated_read" on public.events;
create policy "flowintoone_events_authenticated_read"
on public.events
for select
to authenticated
using (status = 'published' or created_by = (select auth.uid()));

drop policy if exists "flowintoone_events_insert_own_draft" on public.events;
create policy "flowintoone_events_insert_own_draft"
on public.events
for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and status = 'draft'
);

drop policy if exists "flowintoone_events_update_own" on public.events;
create policy "flowintoone_events_update_own"
on public.events
for update
to authenticated
using (created_by = (select auth.uid()))
with check (created_by = (select auth.uid()));

drop policy if exists "flowintoone_events_delete_own" on public.events;
create policy "flowintoone_events_delete_own"
on public.events
for delete
to authenticated
using (created_by = (select auth.uid()));

grant usage on schema public to anon, authenticated;
grant select on table public.events to anon, authenticated;
grant insert, update, delete on table public.events to authenticated;

commit;
