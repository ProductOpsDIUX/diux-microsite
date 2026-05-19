-- =====================================================================
-- Add LinkedIn URLs + leadership flag to team_members.
-- Run in the Supabase SQL editor after 0001_init.sql.
-- =====================================================================

alter table public.team_members
  add column if not exists linkedin_url text,
  add column if not exists is_leadership boolean not null default false;

create index if not exists team_members_leadership_idx
  on public.team_members (is_leadership);
