-- Burger Fest 2026 — Supabase initial schema
-- Run this once in Supabase Dashboard → SQL Editor → "New query"

-- ---------- Types ----------
do $$ begin
  create type public.user_role as enum ('admin', 'restaurante', 'patrocinador');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.submission_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.sponsor_tier as enum ('gold', 'silver', 'bronze');
exception when duplicate_object then null; end $$;

-- ---------- Profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'restaurante',
  display_name text,
  email text,
  phone text,
  created_at timestamptz default now()
);

-- ---------- Restaurants ----------
create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  location text not null,
  schedule text,
  signature_dish text,
  description text,
  instagram text,
  facebook text,
  logo_url text,
  video_url text,
  status public.submission_status not null default 'pending',
  featured boolean default false,
  created_at timestamptz default now()
);

-- ---------- Sponsors ----------
create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade,
  company_name text not null,
  website text,
  contact_name text,
  contact_hours text,
  logo_url text,
  banner_url text,
  tier public.sponsor_tier not null default 'bronze',
  status public.submission_status not null default 'pending',
  created_at timestamptz default now()
);

-- ---------- Events ----------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date text,
  image_url text,
  display_order int default 0,
  created_at timestamptz default now()
);

-- ---------- Auto-create profile on signup ----------
-- SECURITY: only allow non-privileged roles to come from client metadata.
-- Admin role must be granted manually via SQL by an existing admin:
--   update public.profiles set role = 'admin' where email = '...';
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  requested_role text := new.raw_user_meta_data->>'role';
  safe_role public.user_role;
begin
  if requested_role in ('restaurante', 'patrocinador') then
    safe_role := requested_role::public.user_role;
  else
    safe_role := 'restaurante';
  end if;

  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', new.email),
    safe_role
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- RLS (backend uses service role and bypasses RLS) ----------
alter table public.profiles    enable row level security;
alter table public.restaurants enable row level security;
alter table public.sponsors    enable row level security;
alter table public.events      enable row level security;

-- Public read for approved restaurants / sponsors / all events
drop policy if exists "restaurants public read approved" on public.restaurants;
create policy "restaurants public read approved" on public.restaurants
  for select using (status = 'approved');

drop policy if exists "sponsors public read approved" on public.sponsors;
create policy "sponsors public read approved" on public.sponsors
  for select using (status = 'approved');

drop policy if exists "events public read" on public.events;
create policy "events public read" on public.events
  for select using (true);

drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read" on public.profiles
  for select using (auth.uid() = id);

-- ---------- Seed a few events ----------
insert into public.events (title, description, event_date, image_url, display_order) values
  ('Burger Fest 2026 - 6ta Edición', 'El festival gastronómico más importante dedicado a la cultura de las hamburguesas regresa con su sexta edición. Más de 50 restaurantes participantes.', '21 - 30 de Junio, 2026', 'https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/hero-banner.jpg', 1),
  ('Concurso de la Mejor Hamburguesa', 'Los mejores chefs compiten por el título de la mejor hamburguesa del festival. Votación popular y jurado experto.', '25 de Junio, 2026', 'https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/hero-banner.jpg', 2),
  ('Noche de Food Trucks', 'Una experiencia única con los mejores food trucks de la región. Música en vivo y ambiente festivo.', '28 de Junio, 2026', 'https://res.cloudinary.com/ddqarpruz/image/upload/v1779351381/burger-fest/seed/hero-banner.jpg', 3)
on conflict do nothing;

-- ---------- How to create your first admin ----------
-- 1) Sign up a user from the app (any role)
-- 2) Run this SQL with that user's email:
--    update public.profiles set role = 'admin' where email = 'tu-correo@example.com';
