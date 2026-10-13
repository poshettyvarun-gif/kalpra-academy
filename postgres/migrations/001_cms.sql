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
