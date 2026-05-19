-- =====================================================================
-- DI & UX microsite — content schema
-- =====================================================================
-- Singleton-style tables (home_content, page_seo) use a fixed key.
-- Collection tables (case_studies, articles, team_members) are full CRUD.
-- Public reads are unauthenticated; all writes go through service-role
-- key on the server. RLS is enabled but the public role gets SELECT only.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------- HOME PAGE (single row keyed by 'home') ----------
create table if not exists public.home_content (
  id text primary key default 'home',
  -- Hero
  hero_eyebrow text not null default '// Index v3 · 2026.05',
  hero_h1_prefix text not null default 'Designing the',
  hero_h1_rotator text[] not null default array['instruments','decisions','interfaces','outcomes'],
  hero_h1_suffix text not null default 'of modern defence.',
  hero_sub text not null default '',
  -- Pillars / capabilities (array of {title, body})
  pillars jsonb not null default '[]'::jsonb,
  -- Mission / manifesto
  mission_eyebrow text not null default '// Our mission',
  mission_lines text[] not null default '{}',
  -- Stats (array of {value, label})
  stats jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint home_singleton check (id = 'home')
);

-- ---------- CASE STUDIES ----------
create table if not exists public.case_studies (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text not null default '',
  year text not null default '',
  client text not null default '',
  category text not null default '',
  tags text[] not null default '{}',
  hero_image text,
  body text not null default '',  -- markdown / rich text HTML
  featured boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists case_studies_position_idx on public.case_studies (position);

-- ---------- ARTICLES / BLOG ----------
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  cover_image text,
  topic text not null default '',
  body_html text not null default '',  -- rich text HTML from Tiptap
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists articles_published_idx
  on public.articles (is_published, published_at desc);

-- ---------- TEAM ----------
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  bio text not null default '',
  photo text,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists team_members_position_idx on public.team_members (position);

-- ---------- PER-PAGE SEO ----------
create table if not exists public.page_seo (
  path text primary key,         -- '/', '/article', '/case-study', '/team', '/contact'
  title text not null default '',
  description text not null default '',
  og_image text,
  updated_at timestamptz not null default now()
);

-- ---------- updated_at triggers ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$ begin
  perform 1 from pg_trigger where tgname = 'home_content_set_updated_at';
  if not found then
    create trigger home_content_set_updated_at before update on public.home_content
      for each row execute function public.set_updated_at();
    create trigger case_studies_set_updated_at before update on public.case_studies
      for each row execute function public.set_updated_at();
    create trigger articles_set_updated_at before update on public.articles
      for each row execute function public.set_updated_at();
    create trigger team_members_set_updated_at before update on public.team_members
      for each row execute function public.set_updated_at();
    create trigger page_seo_set_updated_at before update on public.page_seo
      for each row execute function public.set_updated_at();
  end if;
end $$;

-- ---------- Row-level security ----------
alter table public.home_content  enable row level security;
alter table public.case_studies  enable row level security;
alter table public.articles      enable row level security;
alter table public.team_members  enable row level security;
alter table public.page_seo      enable row level security;

-- Public read access. Writes go through service-role key (bypasses RLS).
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'home_content_read') then
    create policy home_content_read   on public.home_content  for select using (true);
    create policy case_studies_read   on public.case_studies  for select using (true);
    create policy articles_read       on public.articles      for select using (is_published = true);
    create policy team_members_read   on public.team_members  for select using (true);
    create policy page_seo_read       on public.page_seo      for select using (true);
  end if;
end $$;

-- ---------- Seed: home_content singleton ----------
insert into public.home_content (id) values ('home')
  on conflict (id) do nothing;

-- Default page_seo rows
insert into public.page_seo (path, title, description) values
  ('/',            'DI & UX · Defence Tech Design Innovation & UX', 'Multidisciplinary design practice embedded inside defence technology.'),
  ('/article',     'Thinking · DI & UX',                            'Field notes from inside the loop.'),
  ('/case-study',  'Selected work · DI & UX',                       'Mission-grade software, shipped.'),
  ('/team',        'Team · DI & UX',                                'The people behind the work.'),
  ('/contact',     'Contact · DI & UX',                             'Get in touch.')
on conflict (path) do nothing;
