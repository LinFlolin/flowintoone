-- FLOWINTOONE PHASE 2: authenticated artisan permissions
-- STATE RECORD: apply only to an environment that does not already have this
-- Phase 2 migration. Do not rerun it solely for the profile-trigger update.
-- It does not remove or replace existing SELECT policies.

begin;

-- Stop rather than silently combine these policies with unknown write policies.
-- Existing SELECT-only policies are intentionally ignored and preserved.
do $$
declare
  existing_write_policies text;
begin
  select string_agg(format('%I on %I', policyname, tablename), ', ')
    into existing_write_policies
  from pg_policies
  where schemaname = 'public'
    and tablename in ('profiles', 'businesses')
    and cmd in ('INSERT', 'UPDATE', 'DELETE', 'ALL')
    and policyname not in (
      'flowintoone_profiles_update_own',
      'flowintoone_businesses_insert_own_draft',
      'flowintoone_businesses_update_own'
    );

  if existing_write_policies is not null then
    raise exception 'Existing write policies require manual review: %', existing_write_policies
      using hint = 'Confirm that each policy is owner-scoped, then remove or rename it before rerunning this migration.';
  end if;
end
$$;

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;

-- Profiles are private. Authenticated users receive only the table privileges
-- required for reading and updating their own row; RLS performs row filtering.
revoke all on table public.profiles from anon;
revoke insert, delete, truncate, references, trigger on table public.profiles from authenticated;
grant usage on schema public to authenticated;
grant select, update on table public.profiles to authenticated;

drop policy if exists "flowintoone_profiles_select_own" on public.profiles;
create policy "flowintoone_profiles_select_own"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "flowintoone_profiles_update_own" on public.profiles;
create policy "flowintoone_profiles_update_own"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- This records the trigger already installed in Supabase. Registration supplies
-- full_name through raw_user_meta_data; missing metadata safely produces NULL.
-- ON CONFLICT makes both the trigger and backfill idempotent.
create or replace function public.flowintoone_create_profile_for_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function public.flowintoone_create_profile_for_auth_user() from public;
revoke all on function public.flowintoone_create_profile_for_auth_user() from anon;
revoke all on function public.flowintoone_create_profile_for_auth_user() from authenticated;

drop trigger if exists flowintoone_auth_user_profile on auth.users;
create trigger flowintoone_auth_user_profile
after insert on auth.users
for each row execute function public.flowintoone_create_profile_for_auth_user();

insert into public.profiles (id, full_name)
select users.id, users.raw_user_meta_data ->> 'full_name'
from auth.users as users
on conflict (id) do nothing;

-- Anonymous users retain their existing SELECT grant and published-storefront
-- policy. All anonymous writes are explicitly denied at the privilege layer.
revoke insert, update, delete, truncate, references, trigger
on table public.businesses from anon;

grant select, insert, update on table public.businesses to authenticated;
revoke delete, truncate, references, trigger on table public.businesses from authenticated;
grant select on table public.categories to authenticated;

drop policy if exists "flowintoone_businesses_select_own" on public.businesses;
create policy "flowintoone_businesses_select_own"
on public.businesses
for select
to authenticated
using (owner_id = (select auth.uid()));

drop policy if exists "flowintoone_businesses_insert_own_draft" on public.businesses;
create policy "flowintoone_businesses_insert_own_draft"
on public.businesses
for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  and status::text = 'draft'
);

drop policy if exists "flowintoone_businesses_update_own" on public.businesses;
create policy "flowintoone_businesses_update_own"
on public.businesses
for update
to authenticated
using (owner_id = (select auth.uid()))
with check (
  owner_id = (select auth.uid())
  and (
    status::text = 'draft'
    or (
      status::text = 'published'
      and nullif(btrim(name), '') is not null
      and char_length(btrim(name)) >= 2
      and nullif(btrim(slug), '') is not null
      and nullif(btrim(description), '') is not null
      and category_id is not null
      and nullif(btrim(city), '') is not null
      and nullif(btrim(country), '') is not null
    )
  )
);

commit;

-- Optional post-migration inspection queries:
-- select schemaname, tablename, policyname, roles, cmd, qual, with_check
-- from pg_policies
-- where schemaname = 'public' and tablename in ('profiles', 'businesses')
-- order by tablename, cmd, policyname;
--
-- select grantee, table_name, privilege_type
-- from information_schema.role_table_grants
-- where table_schema = 'public'
--   and table_name in ('profiles', 'businesses', 'categories')
--   and grantee in ('anon', 'authenticated')
-- order by table_name, grantee, privilege_type;
