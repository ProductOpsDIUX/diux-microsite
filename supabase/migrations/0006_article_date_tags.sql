-- =====================================================================
-- Add a display date + tags to articles.
-- Run in the Supabase SQL editor after 0005_article_author.sql.
-- =====================================================================

alter table public.articles
  add column if not exists display_date text not null default '',
  add column if not exists tags text[] not null default '{}';

-- GIN index lets us filter by tag efficiently.
create index if not exists articles_tags_idx on public.articles using gin (tags);
