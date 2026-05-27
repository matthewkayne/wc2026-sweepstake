-- Run this in the Supabase SQL editor to set up the database.

create table if not exists public.sessions (
  id           uuid primary key default gen_random_uuid(),
  admin_token  text not null,          -- SHA-256 hash of host's passphrase
  status       text not null default 'lobby',  -- lobby | complete
  created_at   timestamptz default now()
);

create table if not exists public.participants (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.sessions(id) on delete cascade,
  name        text not null,
  avatar      text not null,
  teams       jsonb,         -- array of team objects assigned after draw
  pick_order  integer,       -- position in the snake draft (for results ordering)
  created_at  timestamptz default now()
);

-- Enable Row Level Security
alter table public.sessions     enable row level security;
alter table public.participants  enable row level security;

-- Allow anyone to read (session codes are unguessable UUIDs)
create policy "sessions_select"      on public.sessions     for select using (true);
create policy "participants_select"  on public.participants  for select using (true);

-- Allow anyone to insert (join a session or create one)
create policy "sessions_insert"      on public.sessions     for insert with check (true);
create policy "participants_insert"  on public.participants  for insert with check (true);

-- Allow anyone to update (admin_token verified client-side before the draw)
create policy "sessions_update"      on public.sessions     for update using (true);
create policy "participants_update"  on public.participants  for update using (true);

-- Enable Realtime for both tables
alter publication supabase_realtime add table public.sessions;
alter publication supabase_realtime add table public.participants;
