-- FLOWINTOONE PHASE 3: storefront images and publish requirements
-- MANUAL REVIEW REQUIRED. This migration is not executed by the application.

begin;

-- Refuse to silently combine this bucket with an unknown write policy that is
-- global or already targets storefront-images. Policies scoped to other named
-- buckets are left untouched.
do $$
declare
  conflicting_policies text;
begin
  select string_agg(policyname, ', ' order by policyname)
    into conflicting_policies
  from pg_policies
  where schemaname = 'storage'
    and tablename = 'objects'
    and cmd in ('INSERT', 'UPDATE', 'DELETE', 'ALL')
    and policyname not in (
      'flowintoone_storefront_images_insert_own',
      'flowintoone_storefront_images_delete_own'
    )
    and (
      coalesce(qual, '') ilike '%storefront-images%'
      or coalesce(with_check, '') ilike '%storefront-images%'
      or (
        coalesce(qual, '') not ilike '%bucket_id%'
        and coalesce(with_check, '') not ilike '%bucket_id%'
      )
    );

  if conflicting_policies is not null then
    raise exception 'Storage write policies require manual review: %', conflicting_policies
      using hint = 'Confirm they cannot write to storefront-images, then narrow or remove them before applying this migration.';
  end if;
end
$$;

-- Public files remain readable through their public Storage URL. The application
-- decodes JPEG/PNG/WebP input and stores only verified WebP output.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'storefront-images',
  'storefront-images',
  true,
  5242880,
  array['image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public access is read-only. Application uploads use unique names, so UPDATE
-- is deliberately not granted by policy; replacements are INSERT + DELETE.
drop policy if exists "flowintoone_storefront_images_public_read" on storage.objects;
create policy "flowintoone_storefront_images_public_read"
on storage.objects
for select
to public
using (bucket_id = 'storefront-images');

drop policy if exists "flowintoone_storefront_images_insert_own" on storage.objects;
create policy "flowintoone_storefront_images_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'storefront-images'
  and split_part(name, '/', 1) = (select auth.uid())::text
  and array_length(string_to_array(name, '/'), 1) = 3
  and split_part(name, '/', 3) ~ '^(logo|cover)-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$'
  and exists (
    select 1
    from public.businesses as business
    where business.id::text = split_part(name, '/', 2)
      and business.owner_id = (select auth.uid())
  )
);

drop policy if exists "flowintoone_storefront_images_delete_own" on storage.objects;
create policy "flowintoone_storefront_images_delete_own"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'storefront-images'
  and split_part(name, '/', 1) = (select auth.uid())::text
  and exists (
    select 1
    from public.businesses as business
    where business.id::text = split_part(name, '/', 2)
      and business.owner_id = (select auth.uid())
  )
);

-- Enforce publish completeness for every new or updated row, including writes
-- made outside the application. NOT VALID preserves any legacy rows while still
-- enforcing the constraint for future writes.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.businesses'::regclass
      and conname = 'flowintoone_businesses_published_fields_check'
  ) then
    alter table public.businesses
      add constraint flowintoone_businesses_published_fields_check
      check (
        status::text <> 'published'
        or (
          nullif(btrim(name), '') is not null
          and char_length(btrim(name)) >= 2
          and nullif(btrim(slug), '') is not null
          and nullif(btrim(description), '') is not null
          and category_id is not null
          and nullif(btrim(city), '') is not null
          and nullif(btrim(country), '') is not null
        )
      ) not valid;
  end if;
end
$$;

-- Keep the owner boundary and mirror the database publishing requirement in RLS.
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

-- Review after applying:
-- select id, public, file_size_limit, allowed_mime_types
-- from storage.buckets where id = 'storefront-images';
--
-- select policyname, roles, cmd, qual, with_check
-- from pg_policies
-- where schemaname = 'storage' and tablename = 'objects'
-- order by policyname;
--
-- Validate the constraint only after any legacy published rows have been audited:
-- alter table public.businesses
-- validate constraint flowintoone_businesses_published_fields_check;
