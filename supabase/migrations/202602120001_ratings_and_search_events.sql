create table if not exists public.ratings (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  tmdb_id bigint not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  stars smallint not null check (stars between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, tmdb_id, media_type)
);

create index if not exists ratings_tmdb_media_idx on public.ratings (tmdb_id, media_type);

alter table public.ratings enable row level security;

create policy if not exists "ratings read all"
on public.ratings
for select
using (true);

create policy if not exists "ratings insert own"
on public.ratings
for insert
to authenticated
with check (auth.uid() = user_id);

create policy if not exists "ratings update own"
on public.ratings
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create table if not exists public.search_events (
  id bigint generated always as identity primary key,
  query text not null,
  created_at timestamptz not null default now()
);

alter table public.search_events enable row level security;

create policy if not exists "search events read all"
on public.search_events
for select
using (true);
