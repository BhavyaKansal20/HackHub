import { Link } from "@tanstack/react-router";
import { Calendar, MapPin, Trophy, Users } from "lucide-react";
import { datesLabel, deadlineLabel, type Hackathon } from "@/lib/hackathons";

export function HackathonCard({ h, recommended }: { h: Hackathon; recommended?: boolean }) {
  const dl = deadlineLabel(h);
  return (
    <Link to="/hackathons/$id" params={{ id: h.id }}
      className="group glass flex flex-col overflow-hidden rounded-[1.75rem] p-5 transition hover:-translate-y-1 hover:border-gold/40 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
      aria-label={`${h.title} hackathon${recommended ? " — recommended for you" : ""}`}
    >
      <div className="flex items-start gap-4">
        <div className="clay grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl">
          {h.image_url ? <img src={h.image_url} alt="" loading="lazy" className="h-full w-full object-cover" /> : <Trophy className="text-gold" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent-foreground">{h.source}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{h.mode}</span>
            {recommended && <span className="rounded-full bg-gold-gradient px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary-foreground">For you</span>}
          </div>
          <h3 className="mt-2 line-clamp-2 text-xl font-semibold leading-tight group-hover:text-gold-soft">{h.title}</h3>
          {h.organizer && <p className="text-sm text-muted-foreground">by {h.organizer}</p>}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
        {datesLabel(h) && <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{datesLabel(h)}</span>}
        {h.location && <span className="flex items-center gap-1.5 truncate"><MapPin className="h-3.5 w-3.5" />{h.location}</span>}
        {h.prize && h.prize !== "$0" && <span className="flex items-center gap-1.5 text-gold-soft"><Trophy className="h-3.5 w-3.5" />{h.prize}</span>}
        {h.participants != null && <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{h.participants.toLocaleString("en-IN")}</span>}
      </div>
      <div className="mt-auto flex items-center justify-between pt-4">
        <div className="flex flex-wrap gap-1">
          {h.tags.slice(0, 3).map((t) => <span key={t} className="neo-inset rounded-full px-2.5 py-0.5 text-xs">{t}</span>)}
        </div>
        {dl && <span className="shrink-0 font-mono text-[11px] text-gold">{dl}</span>}
      </div>
    </Link>
  );
}
