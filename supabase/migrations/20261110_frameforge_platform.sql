-- Run once in Supabase SQL Editor. Safe additions for the Frame Forge web app.
alter table public.films add column if not exists available_until timestamptz;
alter table public.films add column if not exists updated_at timestamptz not null default now();

create table if not exists public.site_settings (
  id boolean primary key default true check (id),
  payment_handle text,
  payment_instructions text,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;

-- Replace the original public-film policy so expired releases disappear automatically.
drop policy if exists "Public can view published films" on public.films;
create policy "Public can view live films" on public.films for select
using (status = 'published' and (available_until is null or available_until > now()));

drop policy if exists "Customers create their orders" on public.orders;
create policy "Customers create their orders" on public.orders for insert to authenticated
with check (buyer_id = auth.uid() and payment_status = 'pending');
drop policy if exists "Customers read own orders" on public.orders;
create policy "Customers read own orders" on public.orders for select to authenticated
using (buyer_id = auth.uid() or public.is_admin());
drop policy if exists "Admins manage orders" on public.orders;
create policy "Admins manage orders" on public.orders for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Customers create order items" on public.order_items;
create policy "Customers create order items" on public.order_items for insert to authenticated
with check (exists (select 1 from public.orders o where o.id = order_id and o.buyer_id = auth.uid() and o.payment_status = 'pending'));
drop policy if exists "Customers read own order items" on public.order_items;
create policy "Customers read own order items" on public.order_items for select to authenticated
using (exists (select 1 from public.orders o where o.id = order_id and (o.buyer_id = auth.uid() or public.is_admin())));
drop policy if exists "Admins manage order items" on public.order_items;
create policy "Admins manage order items" on public.order_items for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public reads site settings" on public.site_settings;
create policy "Public reads site settings" on public.site_settings for select using (true);
drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings" on public.site_settings for all to authenticated
using (public.is_admin()) with check (public.is_admin());

-- Anonymous viewers can be counted; only an admin can read the analytics.
drop policy if exists "Anyone can record a film view" on public.film_views;
create policy "Anyone can record a film view" on public.film_views for insert with check (true);
