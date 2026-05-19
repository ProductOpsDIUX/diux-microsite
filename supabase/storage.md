# Supabase Storage setup

Create a single **public** bucket called `media`:

```sql
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;
```

Or in the dashboard: Storage → New bucket → name `media`, public ✔.

The admin uploads under prefixes:
- `media/hero/…`
- `media/case-studies/<slug>/…`
- `media/articles/<slug>/…`
- `media/team/…`

Writes go through the service role key (server-side), so no storage policies are required beyond the default. If you ever want clients to upload directly, add an authenticated insert policy.
