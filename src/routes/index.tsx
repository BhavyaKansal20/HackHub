import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Search,
  Sparkles,
  SlidersHorizontal,
  Home,
  ChevronRight,
  Flame,
  Trophy,
  Users,
  Award,
  Share2,
} from "lucide-react";
import { hackathonsQuery } from "@/lib/hackathons";
import { HackathonCard } from "@/components/hub/HackathonCard";
import { FlagshipEventModal } from "@/components/hub/FlagshipEventModal";
import { useSession } from "@/lib/session";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HackHub — Every hackathon, one hub for Thapar" },
      { name: "description", content: "Upcoming and ongoing hackathons from Devpost, Devfolio, Unstop and more, with AI fit scores and teammate matching for Thapar students." },
      { property: "og:title", content: "HackHub — Every hackathon, one hub" },
      { property: "og:description", content: "Discover hackathons, see how well you fit, and build your team — made for Thapar." },
    ],
  }),
  component: Index,
});

const CATEGORIES = [
  "All",
  "Hackathons",
  "Competitions",
  "Case Competitions",
  "Quizzes",
  "College Festivals",
] as const;

const MODES = ["All", "Online", "In-person"] as const;

export function Index() {
  const { data = [], isLoading } = useQuery(hackathonsQuery());
  const { user } = useSession();
  const blueprint = useQuery({
    queryKey: ["my-blueprint", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("profiles").select("ai_blueprint,completed").eq("id", user!.id).maybeSingle()).data,
  });

  const recIds = new Set(((blueprint.data?.ai_blueprint as any)?.recommended_hackathon_ids ?? []) as string[]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [mode, setMode] = useState<(typeof MODES)[number]>("All");
  const [source, setSource] = useState("All");
  const [sortBy, setSortBy] = useState<"featured" | "newest" | "prize">("featured");

  const sources = ["All", ...Array.from(new Set(data.map((h) => h.source)))];

  const list = useMemo(() => {
    const s = q.toLowerCase();
    let res = data
      .filter((h) => (mode === "All" || h.mode === mode) && (source === "All" || h.source === source))
      .filter((h) => {
        if (category === "All" || category === "Hackathons") return true;
        return h.tags.some((t) => t.toLowerCase().includes(category.toLowerCase()));
      })
      .filter((h) => !s || [h.title, h.organizer, h.location, ...h.tags].join(" ").toLowerCase().includes(s));

    if (sortBy === "featured") {
      res = res.sort((a, b) => Number(recIds.has(b.id)) - Number(recIds.has(a.id)));
    } else if (sortBy === "newest") {
      res = res.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    } else if (sortBy === "prize") {
      res = res.sort((a, b) => (b.prize ? 1 : 0) - (a.prize ? 1 : 0));
    }
    return res;
  }, [data, q, category, mode, source, sortBy, recIds]);

  const activeFiltersCount = (mode !== "All" ? 1 : 0) + (source !== "All" ? 1 : 0) + (category !== "All" ? 1 : 0) + (q ? 1 : 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Pop-up modal for flagship events */}
      <FlagshipEventModal />

      {/* Top Breadcrumb & Quick Search Bar (Unstop style) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-glass-border/40 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Link to="/" className="flex items-center gap-1 hover:text-gold transition">
            <Home className="h-3.5 w-3.5" /> HackHub
          </Link>
          <ChevronRight className="h-3 w-3 text-border" />
          <span className="font-semibold text-foreground">Hackathons & Competitions</span>
        </div>

        {/* Global Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Hackathons, AI, Web3…"
            className="neo-inset h-10 w-full rounded-full border-0 pl-9 text-sm"
          />
        </div>
      </div>

      {/* Hero Spotlight Header */}
      <section className="relative overflow-hidden rounded-[2.5rem] glass px-6 py-12 text-center md:px-12 md:py-16">
        <img
          src="/HackHubLogo.svg"
          alt="HackHub"
          className="mx-auto mb-6 h-20 sm:h-24 w-auto object-contain drop-shadow-xl"
        />
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-gold">Thapar Institute · Patiala</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-[1.05] sm:text-6xl">
          Discover Hackathons. <em className="text-gold-gradient">Build Squads.</em>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
          Aggregated feeds from Devpost, Devfolio, Unstop & TIET with instant AI fit scores and team matchmaking.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {user ? (
            <Button variant="gold" size="sm" asChild>
              <Link to="/profile">
                <Sparkles className="h-4 w-4 mr-1.5" /> My AI Blueprint
              </Link>
            </Button>
          ) : (
            <Button variant="gold" size="sm" asChild>
              <Link to="/auth">Sign in with Thapar ID</Link>
            </Button>
          )}
          <Button variant="glass" size="sm" asChild>
            <Link to="/team-builder" search={{ post: undefined }}>
              <Users className="h-4 w-4 mr-1.5" /> Team Builder
            </Link>
          </Button>
        </div>

        {/* Live Counters */}
        <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-2.5">
          {[
            [data.length, "live listings"],
            [sources.length - 1, "sources"],
            ["12h", "auto-refresh"],
          ].map(([n, l]) => (
            <div key={String(l)} className="clay rounded-2xl px-2 py-3">
              <div className="font-display text-2xl font-bold text-gold-soft">{n}</div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Unstop-Style Category Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition ${
              category === c
                ? "bg-gold-gradient text-primary-foreground font-semibold shadow-sm"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Filter Chips Bar (Unstop Style: Filters (3), Team Size, Mode, Source, Sort By) */}
      <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-[1.75rem] p-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Active Filter Counter badge */}
          <div className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="grid h-4 w-4 place-items-center rounded-full bg-gold text-[10px] font-bold text-black">
                {activeFiltersCount}
              </span>
            )}
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1">
            {MODES.map((m) => (
              <Button
                key={m}
                size="sm"
                variant={mode === m ? "gold" : "ghost"}
                onClick={() => setMode(m)}
                className="h-8 text-xs rounded-full px-3"
              >
                {m}
              </Button>
            ))}
          </div>

          <span className="h-4 w-px bg-glass-border hidden sm:inline-block" />

          {/* Sources Dropdown/Pills */}
          <div className="flex items-center gap-1">
            {sources.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={source === s ? "secondary" : "ghost"}
                onClick={() => setSource(s)}
                className="h-8 text-xs rounded-full px-3"
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        {/* Sort By Controls */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono uppercase text-[10px] text-muted-foreground hidden sm:inline">Sort:</span>
          {(["featured", "newest", "prize"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`capitalize px-2.5 py-1 rounded-full text-xs transition ${
                sortBy === s ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Content Layout (Cards on Left + Sidebar on Right) */}
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Left Column: Unstop Poster-Style Hackathon Cards */}
        <main className="space-y-5">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass h-48 animate-pulse rounded-[2rem]" />
            ))}

          {list.map((h) => (
            <HackathonCard key={h.id} h={h} recommended={recIds.has(h.id)} />
          ))}

          {/* Empty State */}
          {!isLoading && !list.length && (
            <div className="glass flex flex-col items-center gap-4 rounded-[2rem] py-16 text-center">
              <div className="clay grid h-20 w-20 place-items-center rounded-3xl">
                <Search className="h-8 w-8 text-gold-soft opacity-60" />
              </div>
              <p className="text-xl font-semibold">No hackathons match those filters</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                {q
                  ? `No events match "${q}". Try clearing filters or using different keywords.`
                  : "No events in this category yet. Check back soon — listings update continuously."}
              </p>
              {activeFiltersCount > 0 && (
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => {
                    setQ("");
                    setCategory("All");
                    setMode("All");
                    setSource("All");
                  }}
                  className="rounded-full mt-2"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </main>

        {/* Right Column: Featured Opportunities Sidebar (Unstop Style) */}
        <aside className="space-y-6">
          {/* Flagship Highlight Card */}
          <div className="clay rounded-[2rem] p-6 border border-gold/40 relative overflow-hidden">
            <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-gold">
              <Flame className="h-3.5 w-3.5 text-gold" /> TIET Flagship
            </span>
            <h3 className="mt-2 text-lg font-bold">HackTU 6.0</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              North India's largest student hackathon at Thapar Campus. Cash prizes worth ₹5,00,000+.
            </p>
            <div className="mt-4 flex items-center justify-between text-xs font-mono">
              <span className="text-gold font-bold">₹ 5,00,000</span>
              <span className="text-muted-foreground">Offline @ TIET</span>
            </div>
            <Button variant="gold" size="sm" className="w-full mt-4 rounded-full" asChild>
              <Link to="/team-builder" search={{ post: undefined }}>Find HackTU Team</Link>
            </Button>
          </div>

          {/* Featured Partners / Platforms Widget */}
          <div className="glass rounded-[2rem] p-6 space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Live Integrated Platforms
            </h4>
            <div className="space-y-3">
              {[
                { name: "Devpost", count: "Global challenges", tag: "Online" },
                { name: "Devfolio", count: "India's top tech hubs", tag: "Hybrid" },
                { name: "Unstop", count: "Campus competitions", tag: "Pan-India" },
                { name: "TIET Campus", count: "Internal & OD eligible", tag: "Patiala" },
              ].map((p) => (
                <div key={p.name} className="flex items-center justify-between text-xs py-1.5 border-b border-glass-border/30 last:border-0">
                  <div>
                    <p className="font-semibold text-foreground">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground">{p.count}</p>
                  </div>
                  <span className="neo-inset rounded-full px-2 py-0.5 text-[10px] font-mono text-gold">
                    {p.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Invite Classmates Widget */}
          <div className="clay rounded-[2rem] p-6 space-y-3 border border-glass-border/60">
            <p className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-gold font-semibold">
              <Share2 className="h-3.5 w-3.5" /> Invite Classmates
            </p>
            <p className="text-xs text-muted-foreground">
              Share your referral code with your batchmates to team up for upcoming hackathons.
            </p>
            <Button variant="glass" size="sm" className="w-full rounded-full" asChild>
              <Link to="/profile">Get My Referral Code</Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
