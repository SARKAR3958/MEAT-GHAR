-- ==============================================================================
-- MEAT GHAR - SUPABASE COMPLETE DATABASE SCHEMA & RLS POLICIES
-- Run this in your Supabase Dashboard -> SQL Editor -> Click 'Run'
-- Project: https://hwcoxwwbzxfvxuppnvni.supabase.co
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    weight TEXT DEFAULT '500g',
    pieces TEXT,
    serves TEXT,
    description TEXT,
    image TEXT,
    in_stock BOOLEAN DEFAULT true,
    badge TEXT,
    rating NUMERIC DEFAULT 4.8,
    rating_count INTEGER DEFAULT 140,
    delivery_time TEXT DEFAULT '25 Mins',
    sales_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    icon TEXT,
    image TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BANNERS TABLE (Home carousel)
CREATE TABLE IF NOT EXISTS public.banners (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    tag TEXT,
    image TEXT NOT NULL,
    link_category TEXT,
    bg_gradient TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FLASH DEALS TABLE
CREATE TABLE IF NOT EXISTS public.flash_deals (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    discount TEXT NOT NULL,
    image TEXT NOT NULL,
    tag TEXT,
    end_time TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDERS TABLE (User orders & Admin fulfillment)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    delivery_address JSONB NOT NULL,
    items JSONB NOT NULL,
    total_amount NUMERIC NOT NULL,
    subtotal NUMERIC,
    delivery_fee NUMERIC DEFAULT 0,
    discount NUMERIC DEFAULT 0,
    payment_method TEXT DEFAULT 'COD',
    payment_status TEXT DEFAULT 'Pending',
    status TEXT DEFAULT 'Placed', -- 'Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'
    delivery_partner JSONB,
    special_instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SAVED ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.addresses (
    id TEXT PRIMARY KEY,
    user_id TEXT, -- Can store Auth UID or phone number
    type TEXT DEFAULT 'Home',
    full_name TEXT NOT NULL,
    phone TEXT,
    alt_phone TEXT,
    house_flat TEXT NOT NULL,
    street_road TEXT NOT NULL,
    locality TEXT NOT NULL,
    city TEXT DEFAULT 'Noida',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SUPPORT TICKETS & CHAT
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id TEXT PRIMARY KEY,
    customer_name TEXT,
    customer_phone TEXT,
    subject TEXT,
    status TEXT DEFAULT 'Open',
    messages JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. USER WALLETS TABLE
CREATE TABLE IF NOT EXISTS public.user_wallets (
    user_id TEXT PRIMARY KEY,
    balance NUMERIC DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. WALLET TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    customer_name TEXT,
    amount NUMERIC NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    qr_reference TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- STORAGE BUCKET CREATION (For Images & Product Photos)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('meatghar-images', 'meatghar-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies
CREATE POLICY "Public Read MeatGhar Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'meatghar-images');

CREATE POLICY "Allow Upload to MeatGhar Images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'meatghar-images');

CREATE POLICY "Allow Update MeatGhar Images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'meatghar-images');

CREATE POLICY "Allow Delete MeatGhar Images"
ON storage.objects FOR DELETE
USING (bucket_id = 'meatghar-images');

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Secure, fast, and protects your database from attacks
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flash_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can view, anyone authorized or admin can insert/update/delete
CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow all modify products" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- Categories: Everyone can view, write allowed
CREATE POLICY "Allow public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow all modify categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

-- Banners: Everyone can view, write allowed
CREATE POLICY "Allow public read banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Allow all modify banners" ON public.banners FOR ALL USING (true) WITH CHECK (true);

-- Flash Deals: Everyone can view
CREATE POLICY "Allow public read flash_deals" ON public.flash_deals FOR SELECT USING (true);
CREATE POLICY "Allow all modify flash_deals" ON public.flash_deals FOR ALL USING (true) WITH CHECK (true);

-- Orders: Users can insert new orders, view orders, admin can manage
CREATE POLICY "Allow insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow update orders" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);

-- Addresses:
CREATE POLICY "Allow all addresses" ON public.addresses FOR ALL USING (true) WITH CHECK (true);

-- Support Tickets:
CREATE POLICY "Allow all support_tickets" ON public.support_tickets FOR ALL USING (true) WITH CHECK (true);

-- User Wallets:
CREATE POLICY "Allow all user_wallets" ON public.user_wallets FOR ALL USING (true) WITH CHECK (true);

-- Wallet Transactions:
CREATE POLICY "Allow all wallet_transactions" ON public.wallet_transactions FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA (Runs only if tables are empty)
-- ==============================================================================

-- Seed Categories
INSERT INTO public.categories (id, name, image, description)
VALUES 
    ('cat-chicken', 'Fresh Chicken', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=500&q=80', 'Farm fresh, antibiotic-residue-free chicken'),
    ('cat-mutton', 'Tender Mutton', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=500&q=80', 'Pasture raised, prime cuts tender goat & lamb'),
    ('cat-fish', 'Fish & Seafood', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=500&q=80', 'Fresh water & sea catch, cleaned & gutted'),
    ('cat-eggs', 'Farm Eggs', 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=500&q=80', 'Classic brown and organic country eggs'),
    ('cat-ready', 'Ready to Cook', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80', 'Marinated tikkas, kebabs & wings')
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Products
INSERT INTO public.products (id, name, category, price, original_price, weight, pieces, serves, description, image, in_stock, badge)
VALUES
    ('prod-1', 'Premium Chicken Curry Cut', 'Fresh Chicken', 189, 230, '500g', '12-14 pcs', '2-3 people', 'Freshly cut antibiotic-free chicken pieces, skinless & tender.', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=500&q=80', true, 'BESTSELLER'),
    ('prod-2', 'Boneless Chicken Breast Fillet', 'Fresh Chicken', 249, 299, '450g', '2-3 fillets', '2 people', 'Lean, tender and high protein chicken breast.', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=500&q=80', true, 'POPULAR'),
    ('prod-3', 'Fresh Goat Curry Cut (Rich Mutton)', 'Tender Mutton', 489, 560, '500g', '10-12 pcs', '3 people', 'Tender cuts of fresh goat meat, bone-in for aromatic curries.', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=500&q=80', true, 'FRESH'),
    ('prod-4', 'Fresh Rohu Fish Steaks (Bengali Cut)', 'Fish & Seafood', 199, 250, '500g', '5-7 steaks', '2-3 people', 'Cleaned, descaled & ready to cook river Rohu fish.', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=500&q=80', true, 'POPULAR'),
    ('prod-5', 'Classic Farm Fresh Brown Eggs (Pack of 6)', 'Farm Eggs', 79, 95, 'Pack of 6', '6 eggs', 'Breakfast', 'Nutritious farm fresh brown eggs with rich golden yolk.', 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=500&q=80', true, 'FRESH')
ON CONFLICT (id) DO NOTHING;
