import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, Trophy, Users, Share2, Heart, ExternalLink, Sparkles, Clock, Globe } from "lucide-react";
import { datesLabel, deadlineLabel, type Hackathon } from "@/lib/hackathons";
import { toast } from "sonner";

export function HackathonCard({ h, recommended }: { h: Hackathon; recommended?: boolean }) {
  const dl = deadlineLabel(h);
  const [saved, setSaved] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = typeof window !== "undefined" ? `${window.location.origin}/hackathons/${h.id}` : h.url;
    navigator.clipboard.writeText(url);
    toast.success("Hackathon link copied to clipboard!");
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved((prev) => {
      const next = !prev;
      toast.success(next ? "Saved to your bookmarks" : "Removed from bookmarks");
      return next;
    });
  };

  // Format prize display like Unstop: "Prizes worth ₹..." or "$..."
  const prizeDisplay = h.prize && h.prize !== "$0" ? h.prize : null;

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-glass-border/80 bg-card/75 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-2xl">
      <Link to="/hackathons/$id" params={{ id: h.id }} className="block focus:outline-none">
        {/* Main Header & Poster Section */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 space-y-2">
            {/* Top Source, Mode and Recommended badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-accent/80 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                {h.source}
              </span>
              <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <Globe className="h-3 w-3 text-gold" /> {h.mode}
              </span>
              {recommended && (
                <span className="flex items-center gap-1 rounded-full bg-gold-gradient px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
                  <Sparkles className="h-2.5 w-2.5" /> For You
                </span>
              )}
            </div>

            {/* Hackathon Title */}
            <h2 className="text-xl font-bold leading-snug text-foreground transition group-hover:text-gold-soft sm:text-2xl line-clamp-2">
              {h.title}
            </h2>

            {/* Organizer */}
            {h.organizer && (
              <p className="text-sm font-medium text-muted-foreground">
                {h.organizer}
              </p>
            )}

            {/* Members & Location Row (Unstop style: 👥 1-3 Members | 📍 Online) */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                <Users className="h-3.5 w-3.5 text-gold" />
                1 - 4 Members
              </span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1.5 truncate">
                <MapPin className="h-3.5 w-3.5 text-gold" />
                {h.location || (h.mode === "Online" ? "Online / Virtual" : "In-person")}
              </span>
              {h.participants != null && (
                <>
                  <span className="text-border">|</span>
                  <span className="font-mono text-muted-foreground">
                    {h.participants.toLocaleString("en-IN")} registered
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Poster / Logo Thumbnail */}
          <div className="clay relative h-20 w-20 shrink-0 self-start overflow-hidden rounded-2xl border border-glass-border/70 sm:h-24 sm:w-24">
            {h.image_url ? (
              <img
                src={h.image_url}
                alt={h.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-muted/40">
                <Trophy className="h-8 w-8 text-gold" />
              </div>
            )}
          </div>
        </div>

        {/* Badges & Prize Row (Unstop style) */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-glass-border/40 pt-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="neo-inset rounded-full px-3 py-1 text-xs font-medium text-muted-foreground">
              Everyone can apply
            </span>
            {h.tags.slice(0, 2).map((t) => (
              <span key={t} className="neo-inset rounded-full px-3 py-1 text-xs font-medium text-foreground/90">
                {t}
              </span>
            ))}
            {h.tags.length > 2 && (
              <span className="neo-inset rounded-full px-2.5 py-1 text-xs font-mono text-muted-foreground">
                +{h.tags.length - 2}
              </span>
            )}
          </div>

          {/* Prize Badge */}
          {prizeDisplay && (
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400 shadow-sm">
              <Trophy className="h-3.5 w-3.5 text-emerald-400" />
              <span>Prizes worth {prizeDisplay}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Card Footer: Dates & Quick Action Buttons */}
      <div className="mt-4 flex items-center justify-between border-t border-glass-border/40 pt-3">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          {datesLabel(h) && <span>{datesLabel(h)}</span>}
          {dl && (
            <>
              {datesLabel(h) && <span className="text-border">·</span>}
              <span className="flex items-center gap-1 font-semibold text-gold">
                <Clock className="h-3 w-3" /> {dl}
              </span>
            </>
          )}
        </div>

        {/* Action icons (Share, Heart/Save, More) */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share hackathon"
            className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-accent/60 hover:text-foreground"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleToggleSave}
            aria-label={saved ? "Unsave hackathon" : "Save hackathon"}
            className={`grid h-8 w-8 place-items-center rounded-full transition hover:bg-accent/60 ${
              saved ? "text-red-400" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${saved ? "fill-current" : ""}`} />
          </button>
          <Link
            to="/hackathons/$id"
            params={{ id: h.id }}
            aria-label="View details"
            className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-accent/60 hover:text-gold"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
