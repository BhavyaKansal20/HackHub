-- ============================================================
-- HackHub RLS Security Audit
-- Run this in your Supabase SQL editor to verify all policies.
-- ============================================================

-- 1. Check RLS is enabled on all tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2. List all RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================================
-- Recommended Policies (run if not already present)
-- ============================================================

-- hackathons table: public read, service-role write only
ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "hackathons_select_all" ON public.hackathons;
CREATE POLICY "hackathons_select_all" ON public.hackathons
  FOR SELECT USING (true);
-- INSERT/UPDATE/DELETE restricted to service_role (cron only) — no policy needed,
-- service_role bypasses RLS by default.

-- profiles table: users own their row
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (true); -- campus members can browse profiles

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- team_posts: authenticated read, owner write
ALTER TABLE public.team_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "team_posts_select" ON public.team_posts;
CREATE POLICY "team_posts_select" ON public.team_posts
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

-- team_interests: parties involved only
ALTER TABLE public.team_interests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "team_interests_select" ON public.team_interests;
CREATE POLICY "team_interests_select" ON public.team_interests
  FOR SELECT USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT owner_id FROM public.team_posts WHERE id = post_id)
  );

DROP POLICY IF EXISTS "team_interests_insert" ON public.team_interests;
CREATE POLICY "team_interests_insert" ON public.team_interests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "team_interests_update_owner" ON public.team_interests;
CREATE POLICY "team_interests_update_owner" ON public.team_interests
  FOR UPDATE USING (
    auth.uid() IN (SELECT owner_id FROM public.team_posts WHERE id = post_id)
  );

-- notifications: private to recipient
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;
CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
