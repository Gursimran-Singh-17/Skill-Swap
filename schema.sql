-- SkillSwap PostgreSQL Database Schema
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  primary_category TEXT CHECK (primary_category IN ('Design','Editing','Tutoring','Music')),
  rating FLOAT DEFAULT 5.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gigs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT CHECK (category IN ('Design','Editing','Tutoring','Music')),
  rate NUMERIC NOT NULL,
  rate_type TEXT CHECK (rate_type IN ('fixed','hourly','per_session')),
  description TEXT NOT NULL,
  category_details JSONB,          -- subcategory, portfolioLink, turnaroundTime, subject, genre, etc.
  status TEXT CHECK (status IN ('active','paused')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref TEXT UNIQUE NOT NULL,   -- short code shown to the client, no-auth lookup key
  gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  brief_notes TEXT,
  status TEXT CHECK (status IN ('pending','accepted','declined')) DEFAULT 'pending',
  decline_reason TEXT,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Enable RLS and create public access policies (No Auth required)
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read creators" ON creators FOR SELECT USING (true);
CREATE POLICY "Allow public insert creators" ON creators FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read gigs" ON gigs FOR SELECT USING (true);
CREATE POLICY "Allow public insert gigs" ON gigs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update gigs" ON gigs FOR UPDATE USING (true);

CREATE POLICY "Allow public read bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update bookings" ON bookings FOR UPDATE USING (true);
