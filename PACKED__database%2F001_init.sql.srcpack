create extension if not exists pgcrypto;

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  slug text not null unique,
  sort_order integer not null default 0 check (sort_order >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) check (price is null or price >= 0),
  spice_level smallint not null default 0 check (spice_level between 0 and 3),
  sort_order integer not null default 0 check (sort_order >= 0),
  is_active boolean not null default true,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_price_options (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  label text not null,
  price numeric(10,2) not null check (price >= 0),
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists admin_sessions (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references admin_users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create index if not exists categories_active_sort_idx on categories(is_active, sort_order);
create index if not exists products_category_active_sort_idx on products(category_id, is_active, sort_order);
create index if not exists product_price_options_product_sort_idx on product_price_options(product_id, sort_order);
create index if not exists admin_sessions_token_idx on admin_sessions(token_hash);
create index if not exists admin_sessions_expiry_idx on admin_sessions(expires_at);

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists categories_updated_at on categories;
create trigger categories_updated_at before update on categories
for each row execute function set_updated_at();

drop trigger if exists products_updated_at on products;
create trigger products_updated_at before update on products
for each row execute function set_updated_at();

drop trigger if exists product_price_options_updated_at on product_price_options;
create trigger product_price_options_updated_at before update on product_price_options
for each row execute function set_updated_at();

drop trigger if exists admin_users_updated_at on admin_users;
create trigger admin_users_updated_at before update on admin_users
for each row execute function set_updated_at();

drop trigger if exists app_settings_updated_at on app_settings;
create trigger app_settings_updated_at before update on app_settings
for each row execute function set_updated_at();
