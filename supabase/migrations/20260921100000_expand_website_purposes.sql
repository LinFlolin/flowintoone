-- FLOWINTOONE CREATION FLOW: supported website purpose values
-- MANUAL REVIEW REQUIRED. The application never executes this migration.

begin;

-- Existing shop and events rows remain valid. The constraint is expanded
-- additively so future editor/template work can introduce the other purposes.
alter table public.businesses
  drop constraint if exists flowintoone_businesses_website_purpose_check;

alter table public.businesses
  add constraint flowintoone_businesses_website_purpose_check
  check (
    website_purpose is null
    or website_purpose in ('shop', 'events', 'portfolio', 'services', 'personal')
  ) not valid;

commit;
