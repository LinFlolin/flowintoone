-- FLOWINTOONE STOREFRONT 2.0 / STEP 2
-- MANUAL REVIEW REQUIRED. The application never executes this migration.

begin;

-- Additive fields preserve every existing storefront and remain optional for
-- already-published businesses.
alter table public.businesses
  add column if not exists tagline text,
  add column if not exists materials text,
  add column if not exists creative_process text,
  add column if not exists etsy_url text,
  add column if not exists gallery_image_urls text[] default '{}'::text[];

alter table public.businesses
  alter column gallery_image_urls set default '{}'::text[];

update public.businesses
set gallery_image_urls = '{}'::text[]
where gallery_image_urls is null;

alter table public.businesses
  alter column gallery_image_urls set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.businesses'::regclass
      and conname = 'flowintoone_businesses_storefront_2_text_lengths_check'
  ) then
    alter table public.businesses
      add constraint flowintoone_businesses_storefront_2_text_lengths_check
      check (
        (tagline is null or char_length(btrim(tagline)) between 1 and 160)
        and (description is null or char_length(btrim(description)) between 1 and 4000)
        and (materials is null or char_length(btrim(materials)) between 1 and 2000)
        and (
          creative_process is null
          or char_length(btrim(creative_process)) between 1 and 3000
        )
        and (etsy_url is null or char_length(etsy_url) <= 2048)
      ) not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.businesses'::regclass
      and conname = 'flowintoone_businesses_gallery_size_check'
  ) then
    alter table public.businesses
      add constraint flowintoone_businesses_gallery_size_check
      check (cardinality(gallery_image_urls) <= 6) not valid;
  end if;
end
$$;

-- Keep the existing public media bucket and extend its accepted object names to
-- gallery images. The application still writes verified WebP only.
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

drop policy if exists "flowintoone_storefront_images_insert_own" on storage.objects;
create policy "flowintoone_storefront_images_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'storefront-images'
  and split_part(name, '/', 1) = (select auth.uid())::text
  and array_length(string_to_array(name, '/'), 1) = 3
  and split_part(name, '/', 3) ~ '^(logo|cover|gallery)-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$'
);

drop policy if exists "flowintoone_storefront_images_delete_own" on storage.objects;
create policy "flowintoone_storefront_images_delete_own"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'storefront-images'
  and split_part(name, '/', 1) = (select auth.uid())::text
  and array_length(string_to_array(name, '/'), 1) = 3
  and split_part(name, '/', 3) ~ '^(logo|cover|gallery)-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$'
);

commit;

-- Optional inspection after applying:
-- select column_name, data_type, is_nullable, column_default
-- from information_schema.columns
-- where table_schema = 'public'
--   and table_name = 'businesses'
--   and column_name in (
--     'tagline', 'materials', 'creative_process', 'etsy_url', 'gallery_image_urls'
--   )
-- order by ordinal_position;
--
-- select policyname, roles, cmd, qual, with_check
-- from pg_policies
-- where schemaname = 'storage'
--   and tablename = 'objects'
--   and policyname like 'flowintoone_storefront_images_%'
-- order by cmd, policyname;
