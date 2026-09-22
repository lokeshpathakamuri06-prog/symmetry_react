-- ========================================================
-- SYMMETRY REACT DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Includes all 12 modules: site_sections, banners, products, 
-- categories, collections, projects, blogs, testimonials, 
-- team_members, inquiries, orders, media_assets
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SITE SECTIONS (CMS Content)
CREATE TABLE IF NOT EXISTS public.site_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page VARCHAR(50) NOT NULL,
  section_key VARCHAR(100) NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. HOMEPAGE BANNERS
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  image TEXT NOT NULL,
  badge VARCHAR(100),
  cta_text VARCHAR(100) DEFAULT 'Explore Collection',
  cta_link VARCHAR(255) DEFAULT '/shop',
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  item_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. COLLECTIONS
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  subtitle TEXT,
  description TEXT,
  image TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  product_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  rating DECIMAL(3, 2) DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  badge VARCHAR(100),
  description TEXT,
  details TEXT[] DEFAULT '{}',
  image TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PROJECTS (PORTFOLIO)
CREATE TABLE IF NOT EXISTS public.projects (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  client VARCHAR(255),
  year VARCHAR(50),
  location VARCHAR(255),
  surface VARCHAR(100),
  duration VARCHAR(100),
  image TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  description TEXT,
  challenge TEXT,
  solution TEXT,
  result TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. BLOGS / JOURNAL
CREATE TABLE IF NOT EXISTS public.blogs (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'Interior Design',
  author VARCHAR(255) DEFAULT 'Symmetry Editorial',
  date VARCHAR(100),
  read_time VARCHAR(50) DEFAULT '5 min read',
  image TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TESTIMONIALS
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  location VARCHAR(255),
  avatar TEXT,
  rating INT DEFAULT 5,
  quote TEXT NOT NULL,
  project_title VARCHAR(255),
  featured BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. TEAM MEMBERS
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  bio TEXT,
  image TEXT NOT NULL,
  display_order INT DEFAULT 0,
  social_linkedin VARCHAR(255),
  social_instagram VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. CONTACT FORM INQUIRIES
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(100),
  service VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread', -- unread, read, replied, archived
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id VARCHAR(100) PRIMARY KEY,
  order_number VARCHAR(100) NOT NULL UNIQUE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(100),
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  payment_method VARCHAR(100) DEFAULT 'Card',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. MEDIA ASSETS
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  size_bytes BIGINT DEFAULT 0,
  mime_type VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS POLICIES (ENABLE PUBLIC READ, AUTHENTICATED/API WRITE)
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all content tables
CREATE POLICY "Public Read Site Sections" ON public.site_sections FOR SELECT USING (true);
CREATE POLICY "Public Read Banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Collections" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public Read Blogs" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Public Read Testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public Read Team" ON public.team_members FOR SELECT USING (true);

-- Allow public insert on inquiries (contact form)
CREATE POLICY "Public Insert Inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
-- Allow public insert on orders (checkout)
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Allow full access for anon/authenticated (controlled by frontend / API)
CREATE POLICY "Full Access Site Sections" ON public.site_sections FOR ALL USING (true);
CREATE POLICY "Full Access Banners" ON public.banners FOR ALL USING (true);
CREATE POLICY "Full Access Categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Full Access Collections" ON public.collections FOR ALL USING (true);
CREATE POLICY "Full Access Products" ON public.products FOR ALL USING (true);
CREATE POLICY "Full Access Projects" ON public.projects FOR ALL USING (true);
CREATE POLICY "Full Access Blogs" ON public.blogs FOR ALL USING (true);
CREATE POLICY "Full Access Testimonials" ON public.testimonials FOR ALL USING (true);
CREATE POLICY "Full Access Team" ON public.team_members FOR ALL USING (true);
CREATE POLICY "Full Access Inquiries" ON public.inquiries FOR ALL USING (true);
CREATE POLICY "Full Access Orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Full Access Media" ON public.media_assets FOR ALL USING (true);
