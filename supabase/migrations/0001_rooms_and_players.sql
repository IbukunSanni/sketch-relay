-- Project: SketchRelay (ref mlotvdwaxuwjldpdgjar). Run in its SQL Editor.
--
-- Rooms, and the players seated in them. Only the API writes these tables,
-- with the secret key (the service_role, which skips row-level security).
-- Row-level security is on with no policies, so the browser's publishable
-- key can read nothing here.

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  -- 4 letters, no I or O, so nobody types 1 or 0
  code text not null unique check (code ~ '^[A-HJ-NP-Z]{4}$'),
  host_user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 20),
  -- The first player sits at 0; the next takes one past the highest seat.
  seat int not null check (seat >= 0),
  created_at timestamptz not null default now(),
  -- One seat per user in a room, one user per seat. Two joins racing for
  -- the same seat: one insert fails, and the API tries the next seat.
  unique (room_id, user_id),
  unique (room_id, seat)
);

alter table public.rooms enable row level security;
alter table public.players enable row level security;

grant select, insert, update, delete on public.rooms, public.players to service_role;
