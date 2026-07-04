create table if not exists artworks (
  id uuid primary key default gen_random_uuid(),
  share_slug text unique not null,
  title text not null,
  prompt text not null,
  craft text not null,
  craft_name text not null,
  palette jsonb not null default '[]'::jsonb,
  seed text,
  generation_params jsonb not null default '{}'::jsonb,
  pattern_image_url text not null,
  proposal_image_url text,
  og_image_url text,
  mockup_image_urls jsonb not null default '{}'::jsonb,
  wallpaper_image_urls jsonb not null default '{}'::jsonb,
  narrative jsonb not null default '{}'::jsonb,
  product_scenarios jsonb not null default '[]'::jsonb,
  is_public boolean not null default true,
  like_count integer not null default 0,
  view_count integer not null default 0,
  remix_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists artworks_created_at_idx on artworks(created_at desc);
create index if not exists artworks_craft_idx on artworks(craft);
create index if not exists artworks_public_idx on artworks(is_public);
create index if not exists artworks_like_count_idx on artworks(like_count desc);

create table if not exists artwork_events (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid references artworks(id) on delete cascade,
  event_type text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table artworks enable row level security;
alter table artwork_events enable row level security;

create policy "public artworks are readable"
on artworks for select
using (is_public = true);

create policy "anonymous artwork insert"
on artworks for insert
with check (true);

create policy "anonymous event insert"
on artwork_events for insert
with check (true);
