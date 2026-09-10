create table if not exists public.cms_entries (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.login_attempts (
  id bigint generated always as identity primary key,
  fingerprint text not null,
  attempted_at timestamptz not null default now(),
  succeeded boolean not null default false
);

create index if not exists login_attempts_fingerprint_time_idx
  on public.login_attempts (fingerprint, attempted_at desc);

alter table public.cms_entries enable row level security;
alter table public.login_attempts enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cms-media',
  'cms-media',
  true,
  6291456,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- CMS tables have no public policies. Authenticated server routes use the
-- Supabase secret key, while files in cms-media are intentionally public.
