-- Conquest: Hall of Commanders + worldwide battle stats.
-- Applied to the Supabase project "conquest". Tables are locked by RLS (no policies);
-- the public site can only use the SECURITY DEFINER functions below, which validate input.
create extension if not exists pgcrypto with schema extensions;

create table public.conquest_players (
  id uuid primary key,
  name text not null check (char_length(name) between 2 and 20),
  secret_hash text not null,
  battles_won int not null default 0 check (battles_won between 0 and 100),
  stars int not null default 0 check (stars between 0 and 500),
  bosses int not null default 0 check (bosses between 0 and 20),
  score int not null default 0 check (score between 0 and 1000000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.conquest_players enable row level security;
create index conquest_players_score_idx on public.conquest_players (score desc, updated_at asc);

create table public.conquest_battles (
  level int primary key check (level between 0 and 99),
  wins int not null default 0,
  losses int not null default 0
);
alter table public.conquest_battles enable row level security;

-- conquest_submit(id, secret, name, won, stars, bosses, score): first call claims the id with
-- the hashed secret; later calls must present the same secret. Scores only ever go up.
-- conquest_top(limit), conquest_battle_result(level, win), conquest_battle_stats(), conquest_count()
-- See the migration "conquest_game_tables" in the Supabase dashboard for the full function bodies.
