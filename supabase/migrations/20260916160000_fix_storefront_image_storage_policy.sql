-- FLOWINTOONE PHASE 3 HOTFIX: keep Storage authorization inside the user's
-- authenticated namespace instead of consulting another RLS-protected table.

begin;

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
  and split_part(name, '/', 3) ~ '^(logo|cover)-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$'
);

commit;
