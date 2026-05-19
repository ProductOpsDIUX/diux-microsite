-- =====================================================================
-- Add author byline to articles.
-- Run in the Supabase SQL editor after 0004_resource_thumbnail.sql.
-- =====================================================================

alter table public.articles
  add column if not exists author text not null default '';
