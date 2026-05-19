-- =====================================================================
-- Add thumbnail image column to resources.
-- Run in the Supabase SQL editor after 0003_resources.sql.
-- =====================================================================

alter table public.resources
  add column if not exists thumbnail text;
