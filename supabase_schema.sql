-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Public User Data)
-- This table mirrors the auth.users table via a trigger
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  phone text,
  role text default 'customer' check (role in ('customer', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table public.profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile." on public.profiles for update using (auth.uid() = id);

-- 2. SERVICES TABLE (Pricing)
create table public.services (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null,
  unit text not null, -- 'lb', 'item', 'flat'
  category text, -- 'wash_fold', 'dry_cleaning', 'household'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.services enable row level security;
create policy "Services are viewable by everyone." on public.services for select using (true);
create policy "Only admins can insert/update services." on public.services for all using (
  exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
);

-- Seed some initial data
insert into public.services (name, price, unit, category) values
('Standard Wash & Fold', 2.00, 'lb', 'wash_fold'),
('Comforter (Queen/King)', 25.00, 'item', 'household'),
('Student Special (Stuff-a-Bag)', 25.00, 'flat', 'wash_fold');

alter table public.services add column if not exists is_active boolean default true;
alter table public.services add column if not exists icon text default 'Shirt'; -- Storing icon name string


-- 3. ORDERS TABLE
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  status text default 'pending' check (status in ('pending', 'pickup_scheduled', 'processing', 'out_for_delivery', 'completed', 'cancelled')),
  total_amount decimal(10,2),
  pickup_date timestamp with time zone,
  delivery_address jsonb,
  items jsonb, -- Snapshot of items ordered
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders enable row level security;
create policy "Users can view their own orders." on public.orders for select using (auth.uid() = user_id);
create policy "Users can create orders." on public.orders for insert with check (auth.uid() = user_id);
create policy "Admins can view all orders." on public.orders for select using (
  exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
);

-- 4. TRIGGER FOR NEW USER CREATION
-- Automatically creates a profile entry when a user signs up via Supabase Auth
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. CARE PREFERENCES (Added to Profiles)
-- We will store preferences as a JSONB column on the profiles table
alter table public.profiles add column if not exists preferences jsonb default '{}'::jsonb;
alter table public.profiles add column if not exists address jsonb default '{}'::jsonb;

-- 6. STAIN CONCIERGE REQUESTS
create table if not exists public.stain_requests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  stain_type text,
  fabric text,
  description text,
  image_url text,
  status text default 'pending' check (status in ('pending', 'analyzed', 'completed')),
  expert_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.stain_requests enable row level security;
create policy "Users can view their own stain requests." on public.stain_requests for select using (auth.uid() = user_id);
create policy "Users can create stain requests." on public.stain_requests for insert with check (auth.uid() = user_id);
create policy "Admins can view all stain requests." on public.stain_requests for select using (
  exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' )
);

-- NOTE: You must create a Storage Bucket named 'stains' in the Supabase Dashboard
-- Policy for Storage (if you were running this in SQL Editor):
-- insert into storage.buckets (id, name, public) values ('stains', 'stains', true);
-- create policy "Authenticated users can upload stains" on storage.objects for insert with check ( bucket_id = 'stains' and auth.role() = 'authenticated' );
-- create policy "Public Access to stains" on storage.objects for select using ( bucket_id = 'stains' );
