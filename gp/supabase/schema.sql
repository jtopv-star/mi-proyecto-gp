-- ============================================================
-- Game Programming · esquema de Supabase (plan gratuito)
-- Pégalo completo en: Supabase → SQL Editor → New query → Run
-- ============================================================

-- 1) Jugador (tu perfil, experiencia y mundos desbloqueados)
create table if not exists public.player (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  xp integer not null default 0,
  level integer not null default 1,
  unlocked_worlds text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- 2) Progreso por ejercicio (estado actual + último borrador de código)
create table if not exists public.progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id text not null,
  area text not null,
  completed boolean not null default false,
  best_score integer not null default 0,
  xp_awarded integer not null default 0,
  hints_used integer not null default 0,
  attempts integer not null default 0,
  last_code text,
  first_completed_at timestamptz,
  last_attempt_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, exercise_id)
);

-- 3) Historial de intentos (respuestas enviadas, resultados, puntuaciones, fecha)
create table if not exists public.attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id text not null,
  area text not null,
  code text,
  passed boolean not null,
  score integer not null default 0,
  result_message text,
  hints_used integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists attempts_user_ex_idx on public.attempts (user_id, exercise_id, created_at desc);

-- 4) Pistas consultadas
create table if not exists public.hint_uses (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id text not null,
  hint_index integer not null,
  created_at timestamptz not null default now(),
  unique (user_id, exercise_id, hint_index)
);

-- ============================================================
-- SEGURIDAD: Row Level Security. Solo TÚ ves y modificas TUS filas.
-- ============================================================
alter table public.player    enable row level security;
alter table public.progress  enable row level security;
alter table public.attempts  enable row level security;
alter table public.hint_uses enable row level security;

-- El rol "anon" (visitantes sin sesión) no puede tocar nada.
revoke all on public.player, public.progress, public.attempts, public.hint_uses from anon;
grant select, insert, update on public.player to authenticated;
grant select, insert, update on public.progress to authenticated;
grant select, insert on public.attempts to authenticated;
grant select, insert on public.hint_uses to authenticated;

drop policy if exists "player_own" on public.player;
create policy "player_own" on public.player for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "progress_own" on public.progress;
create policy "progress_own" on public.progress for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "attempts_select_own" on public.attempts;
create policy "attempts_select_own" on public.attempts for select to authenticated
  using ((select auth.uid()) = user_id);
drop policy if exists "attempts_insert_own" on public.attempts;
create policy "attempts_insert_own" on public.attempts for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "hints_select_own" on public.hint_uses;
create policy "hints_select_own" on public.hint_uses for select to authenticated
  using ((select auth.uid()) = user_id);
drop policy if exists "hints_insert_own" on public.hint_uses;
create policy "hints_insert_own" on public.hint_uses for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- ============================================================
-- IMPORTANTE (en el panel, no en SQL):
--   Authentication → Sign In / Providers → desactiva "Allow new users to sign up".
--   Crea TU usuario en Authentication → Users → Add user (correo + contraseña, marca "Auto Confirm User").
-- Así nadie más puede registrarse y la base queda de uso personal.
-- ============================================================
