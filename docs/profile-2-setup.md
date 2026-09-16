# Profile 2.0 setup

Profile 2.0 keeps the existing `profiles.full_name` field and the existing auth-user
trigger. It adds nullable location and avatar-path fields, so current accounts remain
compatible and require no backfill.

The account email continues to come from Supabase Auth claims. It is intentionally
not stored in `public.profiles`.

## Manual database step

Review and apply this migration once in the Supabase SQL Editor:

`supabase/migrations/20260916170000_profile_2.sql`

The application does not execute SQL automatically. The migration:

- adds nullable `city`, `country`, and `avatar_path` columns;
- preserves and reasserts owner-only `profiles` SELECT and UPDATE access;
- keeps anonymous users without table access;
- creates the private `profile-avatars` bucket;
- accepts only WebP objects up to 5 MB in `auth-user-id/avatar-uuid.webp`;
- permits authenticated users to read, insert, and delete only in their own folder;
- deliberately creates no object UPDATE policy because replacement uses INSERT + DELETE;
- stops for manual review if unexpected profile or relevant Storage policies exist.

The server accepts JPEG, PNG, and WebP input, verifies the decoded content, crops it
to an 800 × 800 square, and stores WebP output. Private images are rendered through
one-hour signed URLs generated for the authenticated owner.

## Verification

After applying the migration, inspect the result with the queries included at the
bottom of the SQL file. Then test with two disposable authenticated accounts:

1. Open `/dashboard/profile` as Account A and confirm the existing full name appears.
2. Save a city and country, reload, and confirm both values persist.
3. Confirm the displayed email matches Supabase Auth and no email column was added to
   `public.profiles`.
4. Upload a JPEG, PNG, or WebP avatar no larger than 5 MB. Confirm the stored object is
   WebP and its path starts with Account A's user ID.
5. Replace the avatar and confirm the profile points to a new object and the old object
   is removed after the database update succeeds.
6. Remove the avatar and confirm the database path becomes NULL and the owned object is
   removed.
7. As Account B, attempt to select, upload, or delete inside Account A's avatar folder.
   Supabase must reject every operation.
8. Try a renamed text file, an unsupported type, and an image larger than 5 MB. The
   application must reject each one.
9. Follow **Manage password** and confirm the existing password-update flow still works.

If the migration aborts because it finds an unexpected policy, inspect that policy
instead of bypassing the guard. RLS must remain enabled and no service-role key is
required by this feature.
