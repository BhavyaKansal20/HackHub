import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { hackathonsQuery } from "@/lib/hackathons";
import { HackathonCard } from "@/components/hub/HackathonCard";
import { useSession } from "@/lib/session";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HackHub — Every hackathon, one hub for Thapar" },
      { name: "description", content: "Upcoming and ongoing hackathons from Devpost, Devfolio and more, with AI fit scores and teammate matching for Thapar students." },
      { property: "og:title", content: "HackHub — Every hackathon, one hub" },
      { property: "og:description", content: "Discover hackathons, see how well you fit, and build your team — made for Thapar." },
    ],
  }),
  component: Index,
});

const MODES = ["All", "Online", "In-person"] as const;

function Index() {
  const { data = [], isLoading } = useQuery(hackathonsQuery());
  const { user } = useSession();
  const blueprint = useQuery({
    queryKey: ["my-blueprint", user?.id], enabled: !!user,
    queryFn: async () => (await supabase.from("profiles").select("ai_blueprint,completed").eq("id", user!.id).maybeSingle()).data,
  });
  const recIds = new Set(((blueprint.data?.ai_blueprint as any)?.recommended_hackathon_ids ?? []) as string[]);
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<(typeof MODES)[number]>("All");
  const [source, setSource] = useState("All");
  const sources = ["All", ...Array.from(new Set(data.map((h) => h.source)))];

  const list = useMemo(() => {
    const s = q.toLowerCase();
    return data
      .filter((h) => (mode === "All" || h.mode === mode) && (source === "All" || h.source === source))
      .filter((h) => !s || [h.title, h.organizer, h.location, ...h.tags].join(" ").toLowerCase().includes(s))
      .sort((a, b) => Number(recIds.has(b.id)) - Number(recIds.has(a.id)));
  }, [data, q, mode, source, recIds]);

  return (
    <div>
      <section className="relative mt-6 overflow-hidden rounded-[2.5rem] glass px-6 py-14 text-center md:px-16 md:py-20">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-gold">Thapar Institute · HackHub</p>
        <h1 className="mx-auto mt-5 max-w-3xl text-5xl font-bold leading-[1.02] md:text-7xl">
          Every hackathon. <em className="text-gold-gradient">One hub.</em>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
          Live listings from across the internet, an AI that tells you where you'll shine, and teammates who actually have the skills.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {user ? (
            <Button variant="gold" size="lg" asChild><Link to="/profile"><Sparkles /> My AI blueprint</Link></Button>
          ) : (
            <Button variant="gold" size="lg" asChild><Link to="/auth">Sign in with Thapar ID</Link></Button>
          )}
          <Button variant="glass" size="lg" asChild><Link to="/team-builder" search={{ post: undefined }}>Build your team</Link></Button>
        </div>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-3">
          {[[data.length, "live listings"], [sources.length - 1, "sources"], ["12h", "auto-refresh"]].map(([n, l]) => (
            <div key={String(l)} className="clay rounded-3xl px-3 py-4">
              <div className="font-display text-3xl font-bold text-gold-soft">{n}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="glass flex flex-col gap-3 rounded-[2rem] p-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search AI, Web3, Delhi, Google…" className="neo-inset h-11 rounded-full border-0 pl-10" />
          </div>
          <div className="flex flex-wrap gap-1">
            {MODES.map((m) => <Button key={m} size="sm" variant={mode === m ? "gold" : "ghost"} onClick={() => setMode(m)}>{m}</Button>)}
            <span className="mx-1 w-px bg-border" />
            {sources.map((s) => <Button key={s} size="sm" variant={source === s ? "secondary" : "ghost"} onClick={() => setSource(s)}>{s}</Button>)}
          </div>
        </div>
        {user && blueprint.data && !blueprint.data.ai_blueprint && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link to="/profile" className="text-gold underline-offset-4 hover:underline">Complete your blueprint</Link> to see hackathons picked for you.
          </p>
        )}
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {isLoading && Array.from({ length: 6 }).map((_, i) => <div key={i} className="glass h-56 animate-pulse rounded-[1.75rem]" />)}
          {list.map((h) => <HackathonCard key={h.id} h={h} recommended={recIds.has(h.id)} />)}
        </div>
        {!isLoading && !list.length && <p className="mt-10 text-center text-muted-foreground">No hackathons match those filters.</p>}
      </section>
    </div>
  );
}
