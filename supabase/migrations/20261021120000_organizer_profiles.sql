-- FLOWINTOONE: organizer accounts and organizer storefront content
-- MANUAL REVIEW REQUIRED. The application never executes this migration.

begin;

-- Organizers share the storefront/event infrastructure with artisans, but do
-- not need a product catalogue or craft-specific fields.
alter table public.profiles
  drop constraint if exists flowintoone_profiles_role_check;

alter table public.profiles
  add constraint flowintoone_profiles_role_check
  check (role is null or role in ('visitor', 'artisan', 'organizer', 'admin', 'superadmin')) not valid;

alter table public.businesses
  alter column category_id drop not null;

-- The base schema has an older publishing check with the same purpose. It
-- still requires category_id and would reject the new plain-text “Altro”
-- category even when the organizer publishing check below passes.
alter table public.businesses
  drop constraint if exists businesses_publishing_requirements;

alter table public.businesses
  add column if not exists category_text text,
  add column if not exists organizer_bio text,
  add column if not exists past_events text,
  add column if not exists event_regions text,
  add column if not exists gallery_items jsonb not null default '[]'::jsonb,
  add column if not exists partners jsonb not null default '[]'::jsonb;

alter table public.businesses
  drop constraint if exists flowintoone_businesses_organizer_fields_check;

alter table public.businesses
  add constraint flowintoone_businesses_organizer_fields_check
  check (
    (category_text is null or char_length(btrim(category_text)) between 1 and 120)
    and (organizer_bio is null or char_length(btrim(organizer_bio)) <= 4000)
    and (past_events is null or char_length(btrim(past_events)) <= 5000)
    and (event_regions is null or char_length(btrim(event_regions)) <= 1000)
    and jsonb_typeof(gallery_items) = 'array'
    and jsonb_typeof(partners) = 'array'
  ) not valid;

-- A custom category is stored as plain text, not inserted into the shared
-- categories table. Existing category_id values remain fully supported.
alter table public.businesses
  drop constraint if exists flowintoone_businesses_published_fields_check;

alter table public.businesses
  add constraint flowintoone_businesses_published_fields_check
  check (
    status::text <> 'published'
    or (
      nullif(btrim(name), '') is not null
      and char_length(btrim(name)) >= 2
      and nullif(btrim(slug), '') is not null
      and nullif(btrim(description), '') is not null
      and (category_id is not null or nullif(btrim(category_text), '') is not null)
      and nullif(btrim(city), '') is not null
      and nullif(btrim(country), '') is not null
    )
  ) not valid;

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
      and (category_id is not null or nullif(btrim(category_text), '') is not null)
      and nullif(btrim(city), '') is not null
      and nullif(btrim(country), '') is not null
    )
  )
);

commit;

