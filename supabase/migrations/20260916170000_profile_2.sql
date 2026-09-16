-- FLOWINTOONE PROFILE 2.0 / STEP 1
-- MANUAL REVIEW REQUIRED. The application never executes this migration.

begin;

-- Additive changes keep existing profile rows and the auth-user trigger compatible.
-- The trigger can continue inserting only id and full_name; these columns default to NULL.
alter table public.profiles
  add column if not exists city text,
  add column if not exists country text,
  add column if not exists avatar_path text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'flowintoone_profiles_location_lengths_check'
  ) then
    alter table public.profiles
      add constraint flowintoone_profiles_location_lengths_check
      check (
        (city is null or char_length(btrim(city)) between 1 and 120)
        and (country is null or char_length(btrim(country)) between 1 and 120)
      ) not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'flowintoone_profiles_avatar_path_check'
  ) then
    alter table public.profiles
      add constraint flowintoone_profiles_avatar_path_check
      check (
        avatar_path is null
        or (
          split_part(avatar_path, '/', 1) = id::text
          and array_length(string_to_array(avatar_path, '/'), 1) = 2
          and split_part(avatar_path, '/', 2) ~ '^avatar-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$'
        )
      ) not valid;
  end if;
end
$$;

-- Refuse to combine the owner-only profile rules with unknown policies.
do $$
declare
  unexpected_profile_policies text;
begin
  select string_agg(policyname, ', ' order by policyname)
    into unexpected_profile_policies
  from pg_policies
  where schemaname = 'public'
    and tablename = 'profiles'
    and policyname not in (
      'flowintoone_profiles_select_own',
      'flowintoone_profiles_update_own'
    );

  if unexpected_profile_policies is not null then
    raise exception 'Profile policies require manual review: %', unexpected_profile_policies
      using hint = 'Confirm that each policy is owner-scoped before applying this migration.';
  end if;
end
$$;

alter table public.profiles enable row level security;
revoke all on table public.profiles from public;
revoke all on table public.profiles from anon;
revoke insert, delete, truncate, references, trigger on table public.profiles from authenticated;
grant usage on schema public to authenticated;
grant select, update on table public.profiles to authenticated;

drop policy if exists "flowintoone_profiles_select_own" on public.profiles;
create policy "flowintoone_profiles_select_own"
on public.profiles
for select
to authenticated
using (id = (select auth.uid()));

drop policy if exists "flowintoone_profiles_update_own" on public.profiles;
create policy "flowintoone_profiles_update_own"
on public.profiles
for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

-- Keep profile photos private. The server issues a short-lived signed URL only
-- after the owner has passed the SELECT policy below.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'profile-avatars',
  'profile-avatars',
  false,
  5242880,
  array['image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Stop if an unknown/global write policy could reach the private avatar bucket.
do $$
declare
  conflicting_storage_policies text;
begin
  select string_agg(policyname, ', ' order by policyname)
    into conflicting_storage_policies
  from pg_policies
  where schemaname = 'storage'
    and tablename = 'objects'
    and cmd in ('INSERT', 'UPDATE', 'DELETE', 'ALL')
    and policyname not in (
      'flowintoone_profile_avatars_insert_own',
      'flowintoone_profile_avatars_delete_own'
    )
    and (
      coalesce(qual, '') ilike '%profile-avatars%'
      or coalesce(with_check, '') ilike '%profile-avatars%'
      or (
        coalesce(qual, '') not ilike '%bucket_id%'
        and coalesce(with_check, '') not ilike '%bucket_id%'
      )
    );

  if conflicting_storage_policies is not null then
    raise exception 'Avatar Storage policies require manual review: %', conflicting_storage_policies
      using hint = 'Confirm they cannot write to profile-avatars, then narrow or remove them before retrying.';
  end if;
end
$$;

drop policy if exists "flowintoone_profile_avatars_select_own" on storage.objects;
create policy "flowintoone_profile_avatars_select_own"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'profile-avatars'
  and split_part(name, '/', 1) = (select auth.uid())::text
  and array_length(string_to_array(name, '/'), 1) = 2
  and split_part(name, '/', 2) ~ '^avatar-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$'
);

drop policy if exists "flowintoone_profile_avatars_insert_own" on storage.objects;
create policy "flowintoone_profile_avatars_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'profile-avatars'
  and split_part(name, '/', 1) = (select auth.uid())::text
  and array_length(string_to_array(name, '/'), 1) = 2
  and split_part(name, '/', 2) ~ '^avatar-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$'
);

drop policy if exists "flowintoone_profile_avatars_delete_own" on storage.objects;
create policy "flowintoone_profile_avatars_delete_own"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'profile-avatars'
  and split_part(name, '/', 1) = (select auth.uid())::text
  and array_length(string_to_array(name, '/'), 1) = 2
  and split_part(name, '/', 2) ~ '^avatar-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$'
);

commit;

-- Optional inspection after applying:
-- select column_name, data_type, is_nullable
-- from information_schema.columns
-- where table_schema = 'public' and table_name = 'profiles'
-- order by ordinal_position;
--
-- select policyname, roles, cmd, qual, with_check
-- from pg_policies
-- where (schemaname = 'public' and tablename = 'profiles')
--    or (schemaname = 'storage' and tablename = 'objects'
--        and policyname like 'flowintoone_profile_avatars_%')
-- order by schemaname, tablename, cmd, policyname;
