# Storefront 2.0 setup

Storefront 2.0 extends the existing `businesses` record without replacing or
renaming any current fields. Existing names, descriptions, branding, contact links,
publication state, and public URLs remain intact.

## Manual database step

Review and apply this migration once in the Supabase SQL Editor:

`supabase/migrations/20260916180000_storefront_2.sql`

The application does not execute SQL automatically. The migration:

- adds optional `tagline`, `materials`, `creative_process`, and `etsy_url` fields;
- adds an ordered `gallery_image_urls` array with a maximum of six entries;
- preserves existing storefront rows and initializes only a missing gallery array;
- keeps the existing owner-only business write policies and published-only public read;
- extends the existing Storage INSERT and DELETE policies to unique
  `gallery-<uuid>.webp` objects inside `auth-user-id/business-id/`;
- leaves the public Storage bucket read-only for anonymous visitors;
- does not use a service-role key and does not disable RLS.

The application accepts JPEG, PNG, and WebP input up to 5 MB per file, validates the
decoded content, resizes it, and stores WebP output. A gallery can contain at most six
images. Removal updates the database first and deletes only objects inside the verified
owner/business path.

## Verification

After applying the migration, run the inspection queries included at the bottom of
the SQL file. Then test with two disposable authenticated accounts:

1. Open an existing storefront and confirm all previous values and images still appear.
2. Save a tagline, materials, creative process, and a valid Etsy shop URL; reload and
   confirm the values persist.
3. Upload several gallery images, reload, and confirm their order is stable.
4. Remove one gallery image and confirm its URL leaves `gallery_image_urls` and its
   owned Storage object is deleted after the business update succeeds.
5. Try to exceed six gallery images, upload a renamed text file, an unsupported type,
   and an image over 5 MB. Each operation must be rejected.
6. As Account B, attempt to upload or delete an object below Account A's path. Supabase
   must reject both operations.
7. Confirm a draft storefront still returns 404 publicly.
8. Publish a complete storefront and verify its story, materials, process, gallery,
   Etsy link, existing links, logo, and cover on `/artisans/<slug>`.
9. Check the editor and public page at mobile, tablet, and desktop widths.

The Server Action body limit is 42 MB so six 5 MB gallery sources plus existing logo
and cover inputs can be submitted together. File count, type, decoded content, and
individual size remain validated on the server.
