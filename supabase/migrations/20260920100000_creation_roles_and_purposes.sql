-- FLOWINTOONE CREATION FLOW: account roles and website metadata
-- MANUAL REVIEW REQUIRED. The application never executes this migration.

begin;

alter table public.profiles
  add column if not exists role text;

alter table public.businesses
  add column if not exists website_purpose text,
  add column if not exists design_model text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'flowintoone_profiles_role_check'
  ) then
    alter table public.profiles
      add constraint flowintoone_profiles_role_check
      check (role is null or role in ('visitor', 'artisan')) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.businesses'::regclass
      and conname = 'flowintoone_businesses_website_purpose_check'
  ) then
    alter table public.businesses
      add constraint flowintoone_businesses_website_purpose_check
      check (website_purpose is null or website_purpose in ('shop', 'events')) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.businesses'::regclass
      and conname = 'flowintoone_businesses_design_model_check'
  ) then
    alter table public.businesses
      add constraint flowintoone_businesses_design_model_check
      check (design_model is null or design_model in ('editorial', 'minimal')) not valid;
  end if;
end
$$;

commit;
