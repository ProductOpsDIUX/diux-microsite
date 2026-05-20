-- =====================================================================
-- Hiring roles: add free-text `experience` field (e.g. "3–5 years",
-- "5+ years", "Entry level"). Free-text so admins can match whatever
-- DSTA Careers uses for the source posting.
-- Run after 0007_hiring_roles.sql.
-- =====================================================================

alter table public.hiring_roles
  add column if not exists experience text not null default '';
