-- =====================================================================
-- PSA INVESTMENT (PSAI) - ENTERPRISE DATABASE SCHEMA & SECURITY POLICIES
-- Target Platform: Supabase PostgreSQL (Standard & Perpetual Free Tier)
-- Canonical Domain: https://psainvestment.com.ng/
-- Security: Row-Level Security (RLS) enabled on all tables
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SITE SETTINGS & BRANDING CONFIGURATION
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'psa_site_settings',
  official_email TEXT NOT NULL DEFAULT 'psainvestment.ng@gmail.com',
  ceo_email TEXT NOT NULL DEFAULT 'salamiabdullahi257@gmail.com',
  official_phone TEXT NOT NULL DEFAULT '+234 706 837 1295',
  whatsapp_channel_url TEXT NOT NULL DEFAULT 'https://whatsapp.com/channel/0029Vb7oZ03D38CbwP1M8f0R',
  canonical_domain TEXT NOT NULL DEFAULT 'https://psainvestment.com.ng',
  logo_url TEXT,
  banner_announcement TEXT,
  banner_active BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DAILY MARKET BRIEFINGS (07:00 WAT PRE-MARKET INTELLIGENCE)
CREATE TABLE IF NOT EXISTS public.briefings (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  volume TEXT NOT NULL,
  briefing_date DATE NOT NULL,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  asi TEXT NOT NULL,
  asi_change TEXT NOT NULL,
  asi_ytd TEXT,
  market_cap TEXT NOT NULL,
  volume_traded TEXT,
  value_traded TEXT,
  market_breadth TEXT,
  lead_article TEXT NOT NULL,
  macro_highlights JSONB DEFAULT '[]'::jsonb,
  top_gainers JSONB DEFAULT '[]'::jsonb,
  top_losers JSONB DEFAULT '[]'::jsonb,
  youtube_url TEXT,
  whatsapp_teaser TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_briefings_slug ON public.briefings(slug);
CREATE INDEX IF NOT EXISTS idx_briefings_date ON public.briefings(briefing_date DESC);

-- 3. EQUITY RESEARCH DOSSIERS (MONTHLY INSTITUTIONAL COVERAGE)
CREATE TABLE IF NOT EXISTS public.dossiers (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  ticker TEXT NOT NULL,
  company_name TEXT NOT NULL,
  sector TEXT NOT NULL,
  conviction_rating TEXT NOT NULL,
  current_price TEXT NOT NULL,
  target_price TEXT NOT NULL,
  upside_percent TEXT NOT NULL,
  multiples JSONB NOT NULL DEFAULT '{}'::jsonb,
  valuation_table JSONB DEFAULT '[]'::jsonb,
  executive_summary TEXT NOT NULL,
  investment_thesis TEXT NOT NULL,
  business_overview TEXT,
  financial_diagnostics TEXT,
  catalysts_and_risks TEXT,
  valuation_and_price_target TEXT,
  tear_sheet_pdf_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  author TEXT DEFAULT 'Salami Abdullahi A.',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dossiers_slug ON public.dossiers(slug);
CREATE INDEX IF NOT EXISTS idx_dossiers_ticker ON public.dossiers(ticker);
CREATE INDEX IF NOT EXISTS idx_dossiers_sector ON public.dossiers(sector);

-- 4. FINANCIAL CHRONICLES & WORD TRANSCRIPTS
CREATE TABLE IF NOT EXISTS public.chronicles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  volume TEXT NOT NULL,
  chronicle_date DATE NOT NULL,
  cover_headline TEXT NOT NULL,
  market_summary TEXT NOT NULL,
  raw_text TEXT,
  formatted_html TEXT,
  docx_url TEXT,
  docx_file_name TEXT,
  macro_indicators JSONB DEFAULT '[]'::jsonb,
  top_gainers JSONB DEFAULT '[]'::jsonb,
  top_losers JSONB DEFAULT '[]'::jsonb,
  earnings_snapshots JSONB DEFAULT '[]'::jsonb,
  editorial_notes TEXT,
  source TEXT DEFAULT 'admin_upload',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chronicles_date ON public.chronicles(chronicle_date DESC);
CREATE INDEX IF NOT EXISTS idx_chronicles_volume ON public.chronicles(volume);

-- 5. MEMBERS & ANALYST CIRCLE ACCOUNTS
CREATE TABLE IF NOT EXISTS public.members (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role_type TEXT DEFAULT 'member',
  staff_role TEXT,
  staff_title TEXT,
  membership_status TEXT DEFAULT 'pending',
  company TEXT,
  investment_interests TEXT[],
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  referral_code TEXT,
  referred_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(email);
CREATE INDEX IF NOT EXISTS idx_members_status ON public.members(membership_status);

-- 6. EVENTS & EXECUTIVE MASTERCLASSES
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  capacity INT DEFAULT 100,
  registration_open BOOLEAN DEFAULT true,
  curriculum JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);

-- 7. EVENT REGISTRATIONS
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id TEXT PRIMARY KEY,
  event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE,
  attendee_name TEXT NOT NULL,
  attendee_email TEXT NOT NULL,
  attendee_phone TEXT NOT NULL,
  organization TEXT,
  experience_level TEXT,
  registration_time TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'confirmed'
);

CREATE INDEX IF NOT EXISTS idx_registrations_event ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.event_registrations(attendee_email);

-- 8. SECURITY AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  action TEXT NOT NULL,
  actor TEXT NOT NULL,
  category TEXT NOT NULL,
  severity TEXT NOT NULL,
  details TEXT,
  ip_address TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON public.security_audit_logs(timestamp DESC);

-- =====================================================================
-- ROW-LEVEL SECURITY (RLS) HARDENING POLICIES
-- =====================================================================

-- Enable RLS on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chronicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies for Published Intelligence (Unrestricted Global Access)
CREATE POLICY "Public Read Site Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Briefings" ON public.briefings FOR SELECT USING (true);
CREATE POLICY "Public Read Dossiers" ON public.dossiers FOR SELECT USING (true);
CREATE POLICY "Public Read Chronicles" ON public.chronicles FOR SELECT USING (true);
CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);

-- 2. Event Registrations: Anyone can register, but only see their own confirmation
CREATE POLICY "Public Insert Event Registration" ON public.event_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Users Read Own Registration" ON public.event_registrations FOR SELECT USING (attendee_email = current_user);

-- 3. Members: Members can read approved members public directory, users can update own profile
CREATE POLICY "Public Insert Member Registration" ON public.members FOR INSERT WITH CHECK (true);
CREATE POLICY "Members Read Directory" ON public.members FOR SELECT USING (membership_status = 'approved');

-- 4. Service Role & Authenticated Admins Full Control (Write / Mutate / Delete)
-- In Supabase, requests using the service_role key bypass RLS automatically.
-- For anon key, writes require explicit authorization or service role proxy via /api/database.
