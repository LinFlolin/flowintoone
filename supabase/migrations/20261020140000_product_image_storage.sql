-- FLOWINTOONE: product images share the storefront bucket and business path.

begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('storefront-images', 'storefront-images', true, 5242880, array['image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "flowintoone_storefront_images_insert_own" on storage.objects;
create policy "flowintoone_storefront_images_insert_own"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'storefront-images'
  and split_part(name, '/', 1) = (select auth.uid())::text
  and array_length(string_to_array(name, '/'), 1) = 3
  and split_part(name, '/', 3) ~ '^(logo|cover|gallery|product)-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$'
);

drop policy if exists "flowintoone_storefront_images_delete_own" on storage.objects;
create policy "flowintoone_storefront_images_delete_own"
on storage.objects for delete to authenticated
using (
  bucket_id = 'storefront-images'
  and split_part(name, '/', 1) = (select auth.uid())::text
  and array_length(string_to_array(name, '/'), 1) = 3
  and split_part(name, '/', 3) ~ '^(logo|cover|gallery|product)-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$'
);

commit;
