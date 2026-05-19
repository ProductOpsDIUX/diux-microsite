-- =====================================================================
-- Resources — links + uploaded files for the public Resources page.
-- Run in the Supabase SQL editor after 0002_team_linkedin_leadership.sql.
-- =====================================================================

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  kind text not null check (kind in ('template', 'manual')),
  url text not null,
  file_path text,          -- when uploaded to storage; null for external links
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists resources_kind_idx on public.resources (kind);
create index if not exists resources_position_idx on public.resources (position);

-- updated_at trigger
do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'resources_set_updated_at') then
    create trigger resources_set_updated_at before update on public.resources
      for each row execute function public.set_updated_at();
  end if;
end $$;

alter table public.resources enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'resources_read') then
    create policy resources_read on public.resources for select using (true);
  end if;
end $$;

-- Add Resources to the page_seo table so admin can manage its meta.
insert into public.page_seo (path, title, description) values
  ('/resources', 'Resources · DI & UX', 'Templates and manuals from the DI & UX practice.')
on conflict (path) do nothing;
