create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null,
  base_price bigint not null default 0,
  images jsonb not null default '[]'::jsonb,
  sizes jsonb not null default '[]'::jsonb,
  description text not null default '',
  specs jsonb not null default '[]'::jsonb,
  name_i18n jsonb,
  description_i18n jsonb,
  specs_i18n jsonb,
  featured boolean not null default false,
  visible boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_products_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;

create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_products_updated_at();

alter table public.products enable row level security;

drop policy if exists "Public can read products" on public.products;
drop policy if exists "Public can insert products" on public.products;
drop policy if exists "Public can update products" on public.products;
drop policy if exists "Public can delete products" on public.products;

create policy "Public can read products"
on public.products
for select
to anon, authenticated
using (true);

create policy "Public can insert products"
on public.products
for insert
to anon, authenticated
with check (true);

create policy "Public can update products"
on public.products
for update
to anon, authenticated
using (true)
with check (true);

create policy "Public can delete products"
on public.products
for delete
to anon, authenticated
using (true);
