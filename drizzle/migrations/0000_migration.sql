
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  persona text check (persona in ('student','faculty','phd_scholar','researcher')),
  full_name text, gender text, avatar_url text,
  university text default 'Thapar Institute of Engineering & Technology',
  roll_no text, branch text, current_year int, graduating_year int,
  linkedin_url text, github_url text, portfolio_url text,
  headline text, bio text,
  skills text[] not null default '{}',
  interests text[] not null default '{}',
  experience text,
  ai_blueprint jsonb,
  ai_evaluated_at timestamptz,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "campus can view profiles" on public.profiles for select to authenticated using (true);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Strict institutional domain
create or replace function public.enforce_thapar_domain() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.email is null or lower(split_part(new.email,'@',2)) <> 'thapar.edu' then
    raise exception 'Only @thapar.edu accounts can join HackHub';
  end if;
  insert into public.profiles(id,email,full_name,avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created_hackhub before insert on auth.users for each row execute function public.enforce_thapar_domain();

create table public.hackathons (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  external_id text not null,
  title text not null,
  organizer text,
  url text not null,
  image_url text,
  mode text,
  location text,
  starts_at timestamptz,
  ends_at timestamptz,
  reg_ends_at timestamptz,
  dates_label text,
  prize text,
  participants int,
  tags text[] not null default '{}',
  description text,
  updated_at timestamptz not null default now(),
  unique (source, external_id)
);
grant select on public.hackathons to anon, authenticated;
grant all on public.hackathons to service_role;
alter table public.hackathons enable row level security;
create policy "anyone reads hackathons" on public.hackathons for select to anon, authenticated using (true);

create table public.hackathon_fits (
  user_id uuid not null,
  hackathon_id uuid not null references public.hackathons(id) on delete cascade,
  score int not null,
  verdict text, summary text,
  matched_skills text[] not null default '{}',
  gaps text[] not null default '{}',
  created_at timestamptz not null default now(),
  primary key (user_id, hackathon_id)
);
grant select, insert, update, delete on public.hackathon_fits to authenticated;
grant all on public.hackathon_fits to service_role;
alter table public.hackathon_fits enable row level security;
create policy "own fits" on public.hackathon_fits for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.team_posts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  hackathon_id uuid references public.hackathons(id) on delete set null,
  title text not null check (char_length(title) between 3 and 140),
  description text not null check (char_length(description) <= 3000),
  roles_needed text[] not null default '{}',
  skills_needed text[] not null default '{}',
  spots int not null default 1 check (spots between 1 and 10),
  commitment text,
  status text not null default 'open' check (status in ('open','closed')),
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.team_posts to authenticated;
grant all on public.team_posts to service_role;
alter table public.team_posts enable row level security;
create policy "campus reads posts" on public.team_posts for select to authenticated using (true);
create policy "own posts insert" on public.team_posts for insert to authenticated with check (auth.uid() = owner_id);
create policy "own posts update" on public.team_posts for update to authenticated using (auth.uid() = owner_id);
create policy "own posts delete" on public.team_posts for delete to authenticated using (auth.uid() = owner_id);

create table public.team_interests (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.team_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  message text check (char_length(message) <= 1000),
  status text not null default 'pending' check (status in ('pending','accepted','declined')),
  shared_contact jsonb,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);
grant select, insert, update, delete on public.team_interests to authenticated;
grant all on public.team_interests to service_role;
alter table public.team_interests enable row level security;
create or replace function public.is_post_owner(_post uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.team_posts where id = _post and owner_id = auth.uid())
$$;
create policy "interest visible to both" on public.team_interests for select to authenticated using (auth.uid() = user_id or public.is_post_owner(post_id));
create policy "express interest" on public.team_interests for insert to authenticated with check (auth.uid() = user_id and status = 'pending' and shared_contact is null);
create policy "owner responds" on public.team_interests for update to authenticated using (public.is_post_owner(post_id));
create policy "withdraw interest" on public.team_interests for delete to authenticated using (auth.uid() = user_id);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  kind text not null,
  title text not null,
  body text,
  link text,
  actor_id uuid,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index on public.notifications(user_id, created_at desc);
grant select, update, delete on public.notifications to authenticated;
grant all on public.notifications to service_role;
alter table public.notifications enable row level security;
create policy "own notifications read" on public.notifications for select to authenticated using (auth.uid() = user_id);
create policy "own notifications update" on public.notifications for update to authenticated using (auth.uid() = user_id);
create policy "own notifications delete" on public.notifications for delete to authenticated using (auth.uid() = user_id);

-- Matching fan-out on new team post
create or replace function public.notify_matching_users() returns trigger language plpgsql security definer set search_path = public as $$
declare owner_name text;
begin
  select coalesce(full_name, email) into owner_name from public.profiles where id = new.owner_id;
  insert into public.notifications(user_id, kind, title, body, link, actor_id)
  select p.id, 'team_match', owner_name || ' is looking for teammates',
         new.title || ' — needs ' || array_to_string(new.skills_needed, ', '),
         '/team-builder?post=' || new.id, new.owner_id
  from public.profiles p
  where p.id <> new.owner_id and p.completed
    and exists (select 1 from unnest(p.skills) s, unnest(new.skills_needed) n where lower(s) = lower(n));
  return new;
end $$;
create trigger team_post_fanout after insert on public.team_posts for each row execute function public.notify_matching_users();

create or replace function public.notify_interest() returns trigger language plpgsql security definer set search_path = public as $$
declare p record; who text;
begin
  select * into p from public.team_posts where id = new.post_id;
  if tg_op = 'INSERT' then
    select coalesce(full_name,email) into who from public.profiles where id = new.user_id;
    insert into public.notifications(user_id, kind, title, body, link, actor_id)
    values (p.owner_id, 'interest', who || ' is interested in your team', p.title, '/team-builder?post=' || p.id, new.user_id);
  elsif tg_op = 'UPDATE' and new.status <> old.status and new.status in ('accepted','declined') then
    insert into public.notifications(user_id, kind, title, body, link, actor_id)
    values (new.user_id, 'interest_' || new.status,
      case when new.status='accepted' then 'You are in! Contact details shared' else 'Your interest was declined' end,
      p.title, '/team-builder?post=' || p.id, p.owner_id);
  end if;
  return new;
end $$;
create trigger team_interest_notify after insert or update on public.team_interests for each row execute function public.notify_interest();

alter publication supabase_realtime add table public.notifications;
