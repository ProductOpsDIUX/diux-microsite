-- =====================================================================
-- Hiring roles — open positions surfaced under the contact page's
-- "Latest openings" strip. Each role links out to its DSTA Careers URL.
-- Run in the Supabase SQL editor after 0006_article_date_tags.sql.
-- =====================================================================

create table if not exists public.hiring_roles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department text not null default '',
  location text not null default 'Singapore',
  url text not null,                 -- link to careersearch.dsta.gov.sg posting
  summary text not null default '',
  position integer not null default 0,
  is_open boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists hiring_roles_open_idx on public.hiring_roles (is_open);
create index if not exists hiring_roles_position_idx on public.hiring_roles (position);

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'hiring_roles_set_updated_at') then
    create trigger hiring_roles_set_updated_at before update on public.hiring_roles
      for each row execute function public.set_updated_at();
  end if;
end $$;

alter table public.hiring_roles enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'hiring_roles_read') then
    create policy hiring_roles_read on public.hiring_roles for select using (is_open = true);
  end if;
end $$;
