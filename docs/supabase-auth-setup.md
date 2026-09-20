# Supabase Auth setup

The application uses Supabase's cookie-based PKCE flow through `@supabase/ssr`.
Normal requests use the publishable key. The account deletion action also uses a
server-only service-role key because Supabase Auth user deletion is an admin operation.

## 1. Database state record

The live project already has the profile trigger and backfill described in:

`supabase/migrations/20260916130000_artisan_auth_dashboard_rls.sql`

This application change did not execute SQL. Do not rerun the migration solely to
install the trigger. For a new environment that does not yet have the Phase 2 schema,
review the whole migration before applying it once.

The migration:

- records the existing `flowintoone_auth_user_profile` trigger, which creates one
  `profiles` row for every Auth user and copies the `full_name` metadata;
- backfills missing profiles for existing Auth users;
- grants authenticated users the minimum table privileges they need;
- lets users read and update only their own profile;
- lets business owners create drafts and read/update only their own businesses;
- validates the required storefront fields when publishing;
- preserves the existing public SELECT policies;
- refuses to run if unknown write policies need manual review.

The application does not insert into `profiles` during registration or login. Profile
creation belongs exclusively to the database trigger. Registration sends `full_name`
inside `raw_user_meta_data`, and authenticated users can update their own name from
`/dashboard/profile`.

## 2. Environment variables

Local `.env.local` and production hosting settings need:

```text
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://your-production-domain.example
```

Use `NEXT_PUBLIC_SITE_URL=http://localhost:3000` locally if desired. When it is
missing locally, server actions use the incoming request origin.

`SUPABASE_SERVICE_ROLE_KEY` must be configured only in the server environment. Never
prefix it with `NEXT_PUBLIC_`, commit it, or expose it to browser code. It is required
when a user confirms deletion from `/dashboard/profile`.

## 3. Supabase dashboard URL configuration

In **Authentication → URL Configuration** set:

- Site URL: the canonical production origin, for example `https://flowintoone.example`
- Redirect URL: `http://localhost:3000/auth/callback`
- Redirect URL: `http://localhost:3000/update-password`
- Redirect URL: `https://your-production-domain.example/auth/callback`
- Redirect URL: `https://your-production-domain.example/update-password`

If deployment previews are needed, add a narrowly scoped preview wildcard separately.

## 4. Email templates

The default Supabase confirmation template works with the `emailRedirectTo` passed
by the application. If you intentionally switch to a custom token-hash template,
point it to the app's `/auth/confirm` handler:

```text
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/dashboard
```

Password recovery redirects through `/auth/callback` and ends at
`/update-password`. Configure custom SMTP before production; the built-in sender
is intended only for limited testing.

## 5. Profile 2.0

The optional location fields and private avatar Storage configuration are documented
in `docs/profile-2-setup.md`. Apply its migration separately; it remains compatible
with the profile trigger described above.

## 6. Account deletion

The profile page requires the signed-in user to type `DELETE`. The server then removes
all Storage objects below that user's UUID in the `profile-avatars` and
`storefront-images` buckets, deletes their `businesses` and `profiles` rows, deletes
the Supabase Auth user through the admin API, and signs out the session. Storage is
cleaned before database/Auth deletion because Auth cascades do not remove Storage
objects.

Test this with a disposable account after applying the profile and storefront
migrations. Confirm that the Auth user, profile row, storefront rows, and all objects
under the user's UUID are gone. An incorrectly configured service-role key leaves the
account intact and shows an error on the profile page.
