# Storefront image storage

Phase 3 stores public storefront media in the `storefront-images` Supabase Storage
bucket. The application never uses a service-role key.

## Manual database step

Review and apply this migration once in the Supabase SQL Editor:

`supabase/migrations/20260916150000_storefront_images_and_publish_requirements.sql`

The application does not execute the migration automatically. It:

- creates or configures the public `storefront-images` bucket;
- limits stored objects to 5 MB WebP output; the application accepts JPEG, PNG,
  and WebP source images and converts them before upload;
- allows public reads but no public writes;
- permits an authenticated user to insert and delete only below
  `auth-user-id/owned-business-id/`;
- accepts only unique `logo-<uuid>.webp` and `cover-<uuid>.webp` object names;
- deliberately provides no object UPDATE policy;
- adds a non-destructive `NOT VALID` check for future published business writes;
- restores the owner-only business UPDATE policy with publishing requirements.

The server checks file size and declared type, decodes the actual image content,
rejects unsupported data, resizes it, and writes WebP output. Replacing an image
uploads a unique object first, updates the database URL, and only then removes the
previous owned object.

## First upload

1. Create the draft storefront if one does not already exist.
2. Open `/dashboard/storefront`.
3. Select a logo and/or cover image. The local preview appears immediately.
4. Choose **Save changes**. Images are optional for publishing.
5. Complete name, description, category, city, and country, then choose
   **Publish storefront**.

The public page is `/artisans/<slug>`. Drafts intentionally return 404 there.

## Security verification

Use two disposable authenticated accounts after applying the migration:

1. Account A creates a draft and uploads an image. Confirm its object path begins
   with Account A's user ID and that draft's business ID.
2. Account B attempts to upload to the same path prefix. Supabase must reject the
   request with an RLS error.
3. Account B attempts to delete Account A's object. Supabase must reject it.
4. Upload a text file renamed as `.jpg`, an image larger than 5 MB, and an
   unsupported image type. The application must reject each one.
5. Replace Account A's image. Confirm the database URL points to a new unique
   `.webp` object and the old object is removed only after the update succeeds.
6. Confirm the draft URL returns 404. Complete all required fields, publish, and
   confirm the same URL returns 200 and is linked from the homepage.
