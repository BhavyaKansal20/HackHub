import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { ArrowUpRight, Calendar, MapPin, Sparkles, Trophy, Users } from "lucide-react";
import { hackathonQuery, datesLabel, deadlineLabel } from "@/lib/hackathons";
import { getHackathonFit, type Fit } from "@/lib/hub.functions";
import { useSession } from "@/lib/session";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/hackathons/$id")({
  head: () => ({
    meta: [
      { title: "Hackathon details — HackHub" },
      { name: "description", content: "Hackathon summary, dates, prizes and your personal AI fit score." },
      { property: "og:title", content: "Hackathon details — HackHub" },
      { property: "og:description", content: "See the details and how well your skills fit." },
    ],
  }),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const { data: h, isLoading } = useQuery(hackathonQuery(id));
  const { user } = useSession();
  const fitFn = useServerFn(getHackathonFit);
  const fit = useMutation({ mutationFn: (refresh: boolean) => fitFn({ data: { hackathonId: id, refresh } }) as Promise<Fit> });
  useEffect(() => { if (user && h) fit.mutate(false); /* eslint-disable-next-line */ }, [user?.id, h?.id]);

  if (isLoading) return <div className="glass mt-8 h-80 animate-pulse rounded-[2rem]" />;
  if (!h) return <p className="mt-16 text-center text-muted-foreground">This hackathon is no longer listed. <Link to="/" className="text-gold">Back to all</Link></p>;
  const dl = deadlineLabel(h);
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
      <article className="glass rounded-[2rem] p-8">
        <div className="flex items-center gap-5">
          <div className="clay h-24 w-24 shrink-0 overflow-hidden rounded-3xl">
            {h.image_url && <img src={h.image_url} alt="" className="h-full w-full object-cover" />}
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-gold">{h.source} · {h.mode}</p>
            <h1 className="mt-1 text-4xl font-bold leading-tight md:text-5xl">{h.title}</h1>
            {h.organizer && <p className="text-muted-foreground">by {h.organizer}</p>}
          </div>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {datesLabel(h) && <Info icon={<Calendar />} label="Dates" value={datesLabel(h)!} />}
          {h.location && <Info icon={<MapPin />} label="Where" value={h.location} />}
          {h.prize && h.prize !== "$0" && <Info icon={<Trophy />} label="Prizes" value={h.prize} />}
          {h.participants != null && <Info icon={<Users />} label="Registered" value={h.participants.toLocaleString("en-IN")} />}
        </div>
        {h.description && h.source !== "Devpost" && <p className="mt-8 text-lg leading-relaxed">{h.description}</p>}
        {!!h.tags.length && <div className="mt-6 flex flex-wrap gap-2">{h.tags.map((t) => <span key={t} className="neo-inset rounded-full px-3 py-1 text-sm">{t}</span>)}</div>}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button variant="gold" size="lg" asChild><a href={h.url} target="_blank" rel="noreferrer">Register on {h.source} <ArrowUpRight /></a></Button>
          <Button variant="glass" size="lg" asChild><Link to="/team-builder" search={{ post: undefined }}>Find teammates</Link></Button>
          {dl && <span className="font-mono text-sm text-gold">{dl}</span>}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Registration happens on the organiser's site so your entry counts officially.</p>
      </article>

      <aside className="glass h-fit rounded-[2rem] p-6">
        <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gold"><Sparkles className="h-4 w-4" /> Your fit</p>
        {!user ? (
          <div className="mt-4">
            <p className="text-muted-foreground">Sign in to see how your skills match this hackathon.</p>
            <Button className="mt-4 w-full" variant="gold" asChild><Link to="/auth">Sign in with Thapar ID</Link></Button>
          </div>
        ) : fit.isPending ? (
          <div className="mt-4 space-y-3"><div className="neo-inset h-24 animate-pulse rounded-3xl" /><p className="text-sm text-muted-foreground">Evaluating your profile against this hackathon…</p></div>
        ) : fit.error ? (
          <p className="mt-4 text-sm text-destructive">{(fit.error as Error).message}</p>
        ) : fit.data ? (
          <div className="mt-4">
            <div className="flex items-end gap-3">
              <span className="font-display text-6xl font-bold text-gold-gradient">{fit.data.score}</span>
              <span className="pb-2 font-mono text-xs text-muted-foreground">/ 100 match</span>
            </div>
            <div className="neo-inset mt-2 h-2 overflow-hidden rounded-full"><div className="h-full bg-gold-gradient" style={{ width: `${fit.data.score}%` }} /></div>
            <p className="mt-4 text-lg font-semibold">{fit.data.verdict}</p>
            <p className="mt-2 text-muted-foreground">{fit.data.summary}</p>
            {!!fit.data.matched_skills.length && <Chips title="What fits" items={fit.data.matched_skills} />}
            {!!fit.data.gaps.length && <Chips title="Recruit or learn" items={fit.data.gaps} muted />}
            <Button variant="ghost" size="sm" className="mt-4" onClick={() => fit.mutate(true)}>Re-evaluate</Button>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="clay flex items-center gap-3 rounded-3xl p-4 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-gold">
      {icon}<div><div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div><div>{value}</div></div>
    </div>
  );
}
function Chips({ title, items, muted }: { title: string; items: string[]; muted?: boolean }) {
  return (
    <div className="mt-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{title}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">{items.map((s) => <span key={s} className={muted ? "neo-inset rounded-full px-2.5 py-0.5 text-sm" : "rounded-full bg-accent px-2.5 py-0.5 text-sm text-accent-foreground"}>{s}</span>)}</div>
    </div>
  );
}
