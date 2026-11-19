-- ============================================================
-- HACKHUB COMPLETE SUPABASE DATABASE SETUP & AUTH TRIGGERS
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 2. CREATE TABLES
-- ============================================================

-- Table: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  persona TEXT DEFAULT 'student',
  gender TEXT,
  avatar_url TEXT,
  university TEXT DEFAULT 'Thapar Institute of Engineering & Technology, Patiala',
  roll_no TEXT,
  branch TEXT,
  current_year INT,
  graduating_year INT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  headline TEXT,
  bio TEXT,
  experience TEXT,
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  ai_blueprint JSONB,
  ai_evaluated_at TIMESTAMPTZ,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Table: hackathons
CREATE TABLE IF NOT EXISTS public.hackathons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  external_id TEXT NOT NULL,
  source TEXT NOT NULL,
  url TEXT NOT NULL,
  image_url TEXT,
  mode TEXT,
  location TEXT,
  organizer TEXT,
  prize TEXT,
  participants INT,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  reg_ends_at TIMESTAMPTZ,
  dates_label TEXT,
  tags TEXT[] DEFAULT '{}',
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT hackathons_source_external_id_key UNIQUE (source, external_id)
);

-- Table: team_posts
CREATE TABLE IF NOT EXISTS public.team_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  hackathon_id UUID REFERENCES public.hackathons(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  skills_needed TEXT[] NOT NULL,
  roles_needed TEXT[] DEFAULT '{}',
  spots INT DEFAULT 2 NOT NULL,
  commitment TEXT,
  status TEXT DEFAULT 'open' NOT NULL CHECK (status IN ('open', 'filled', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Table: team_interests
CREATE TABLE IF NOT EXISTS public.team_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.team_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'accepted', 'declined')),
  shared_contact JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT team_interests_post_user_key UNIQUE (post_id, user_id)
);

-- Table: notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Table: hackathon_fits
CREATE TABLE IF NOT EXISTS public.hackathon_fits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  hackathon_id UUID NOT NULL REFERENCES public.hackathons(id) ON DELETE CASCADE,
  score INT NOT NULL,
  verdict TEXT,
  summary TEXT,
  matched_skills TEXT[] DEFAULT '{}',
  gaps TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT hackathon_fits_user_hackathon_key UNIQUE (user_id, hackathon_id)
);

-- ============================================================
-- 3. GOOGLE OAUTH DOMAIN GATE & PROFILE AUTO-CREATION TRIGGERS
-- ============================================================

-- Trigger 1 (BEFORE INSERT): Reject non-@thapar.edu emails
CREATE OR REPLACE FUNCTION public.check_thapar_domain()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email IS NULL OR lower(split_part(NEW.email, '@', 2)) <> 'thapar.edu' THEN
    RAISE EXCEPTION 'Access Denied: Only @thapar.edu accounts are permitted to join HackHub.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_check_thapar_domain ON auth.users;
CREATE TRIGGER tr_check_thapar_domain
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.check_thapar_domain();

-- Trigger 2 (AFTER INSERT): Auto-create profile row once auth.users row is committed
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    persona,
    completed
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Thapar Builder'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    'student',
    false
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_handle_new_auth_user ON auth.users;
CREATE TRIGGER tr_handle_new_auth_user
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();

-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Hackathons
ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "hackathons_read_public" ON public.hackathons;
CREATE POLICY "hackathons_read_public" ON public.hackathons
  FOR SELECT USING (true);

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_read_all" ON public.profiles;
CREATE POLICY "profiles_read_all" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Team Posts
ALTER TABLE public.team_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "team_posts_read_authenticated" ON public.team_posts;
CREATE POLICY "team_posts_read_authenticated" ON public.team_posts
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "team_posts_insert_own" ON public.team_posts;
CREATE POLICY "team_posts_insert_own" ON public.team_posts
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "team_posts_update_own" ON public.team_posts;
CREATE POLICY "team_posts_update_own" ON public.team_posts
  FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "team_posts_delete_own" ON public.team_posts;
CREATE POLICY "team_posts_delete_own" ON public.team_posts
  FOR DELETE USING (auth.uid() = owner_id);

-- Team Interests
ALTER TABLE public.team_interests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "team_interests_read_involved" ON public.team_interests;
CREATE POLICY "team_interests_read_involved" ON public.team_interests
  FOR SELECT USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT owner_id FROM public.team_posts WHERE id = post_id)
  );

DROP POLICY IF EXISTS "team_interests_insert_own" ON public.team_interests;
CREATE POLICY "team_interests_insert_own" ON public.team_interests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "team_interests_update_owner" ON public.team_interests;
CREATE POLICY "team_interests_update_owner" ON public.team_interests
  FOR UPDATE USING (
    auth.uid() IN (SELECT owner_id FROM public.team_posts WHERE id = post_id)
  );

-- Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "notifications_read_own" ON public.notifications;
CREATE POLICY "notifications_read_own" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Hackathon Fits
ALTER TABLE public.hackathon_fits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "hackathon_fits_read_own" ON public.hackathon_fits;
CREATE POLICY "hackathon_fits_read_own" ON public.hackathon_fits
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "hackathon_fits_write_own" ON public.hackathon_fits;
CREATE POLICY "hackathon_fits_write_own" ON public.hackathon_fits
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 5. STORAGE BUCKET FOR AVATARS
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated'
  );
