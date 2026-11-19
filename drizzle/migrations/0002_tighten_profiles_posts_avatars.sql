create or replace function public.is_campus_member() returns boolean language sql stable set search_path = public as $$
  select lower(split_part(coalesce(auth.jwt()->>'email',''),'@',2)) = 'thapar.edu'
$$;

drop policy "campus can view profiles" on public.profiles;
create policy "campus can view profiles" on public.profiles for select to authenticated using (auth.uid() = id or public.is_campus_member());

revoke select on public.profiles from authenticated;
grant select (id, persona, full_name, gender, avatar_url, university, roll_no, branch, current_year, graduating_year,
  linkedin_url, github_url, portfolio_url, headline, bio, skills, interests, experience, ai_blueprint, ai_evaluated_at,
  completed, created_at, updated_at) on public.profiles to authenticated;

drop policy "campus reads posts" on public.team_posts;
create policy "campus reads posts" on public.team_posts for select to authenticated using (auth.uid() = owner_id or public.is_campus_member());

drop policy "avatars readable" on storage.objects;
create policy "users read own avatar files" on storage.objects for select to authenticated using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);