import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import {
  ArrowUpRight,
  Calendar,
  MapPin,
  Sparkles,
  Trophy,
  Users,
  Globe,
  Share2,
  Heart,
  Home,
  CheckCircle2,
  Clock,
  Award,
  HelpCircle,
  MessageSquare,
  FileText,
  Star,
  ExternalLink,
} from "lucide-react";
import { hackathonQuery, datesLabel, deadlineLabel } from "@/lib/hackathons";
import { getHackathonFit, type Fit } from "@/lib/hub.functions";
import { useSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/hackathons/$id")({
  head: () => ({
    meta: [
      { title: "Hackathon details — HackHub" },
      { name: "description", content: "Hackathon stages, timeline, eligibility, rules, prizes and your personal AI fit score." },
      { property: "og:title", content: "Hackathon details — HackHub" },
      { property: "og:description", content: "See stages, rules, and how well your skills fit." },
    ],
  }),
  component: Detail,
});

type TabType = "overview" | "timeline" | "details" | "prizes" | "reviews" | "faqs";

function Detail() {
  const { id } = Route.useParams();
  const { data: h, isLoading } = useQuery(hackathonQuery(id));
  const { user } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [saved, setSaved] = useState(false);

  const fitFn = useServerFn(getHackathonFit);
  const fit = useMutation({
    mutationFn: (refresh: boolean) => fitFn({ data: { hackathonId: id, refresh } }) as Promise<Fit>,
  });

  useEffect(() => {
    if (user && h) fit.mutate(false);
  }, [user?.id, h?.id]);

  if (isLoading) return <div className="glass mt-8 h-96 animate-pulse rounded-[2.5rem]" />;
  if (!h) {
    return (
      <div className="glass mt-16 rounded-[2rem] p-12 text-center text-muted-foreground">
        <p className="text-xl">This hackathon is no longer active.</p>
        <Button variant="gold" size="sm" asChild className="mt-4">
          <Link to="/">Explore All Hackathons</Link>
        </Button>
      </div>
    );
  }

  const dl = deadlineLabel(h);
  const prizeDisplay = h.prize && h.prize !== "$0" ? h.prize : "₹ 15,00,000+";

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : h.url;
    navigator.clipboard.writeText(url);
    toast.success("Hackathon link copied to clipboard!");
  };

  const handleToggleSave = () => {
    setSaved((prev) => {
      const next = !prev;
      toast.success(next ? "Saved to your bookmarks" : "Removed from bookmarks");
      return next;
    });
  };

  const bannerImg =
    h.image_url ||
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80";

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Wide Hero Banner Image (Unstop Style) */}
      <div className="clay relative h-56 w-full overflow-hidden rounded-[2.5rem] border border-glass-border/70 sm:h-72 lg:h-80">
        <img src={bannerImg} alt={h.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-accent px-3 py-1 font-mono text-xs uppercase tracking-wider text-accent-foreground font-semibold backdrop-blur-md">
              {h.source}
            </span>
            <span className="flex items-center gap-1.5 rounded-full glass px-3 py-1 font-mono text-xs text-foreground backdrop-blur-md">
              <Globe className="h-3.5 w-3.5 text-gold" /> {h.mode}
            </span>
          </div>
          {dl && (
            <span className="flex items-center gap-1.5 rounded-full bg-black/60 border border-gold/40 px-3.5 py-1 text-xs font-mono text-gold backdrop-blur-md">
              <Clock className="h-3.5 w-3.5" /> {dl}
            </span>
          )}
        </div>
      </div>

      {/* 2. Unstop Navigation Tab Bar (Copy of Image 3) */}
      <div className="glass sticky top-[72px] z-30 flex items-center gap-1 overflow-x-auto rounded-full px-3 py-1.5 backdrop-blur-2xl border border-glass-border/80">
        {[
          { id: "overview", label: "Overview", icon: Home },
          { id: "timeline", label: "Stages & Timeline", icon: Calendar },
          { id: "details", label: "Details", icon: FileText },
          { id: "prizes", label: "Prizes", icon: Trophy },
          { id: "reviews", label: "Reviews", icon: Star },
          { id: "faqs", label: "FAQs & Discussions", icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition ${
                isActive
                  ? "bg-gold text-black font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Main 2-Column Split: Content Area + Sticky Action Sidebar */}
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left Column: Event Information & Tab Panes */}
        <div className="space-y-6">
          {/* Header Card (Image 2 style) */}
          <article className="glass rounded-[2rem] p-6 sm:p-8 space-y-6 border border-glass-border">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-gold">
                  <span>{h.mode} Challenge</span>
                  <span>·</span>
                  <span>{h.source} Verified</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold leading-tight text-foreground">
                  {h.title}
                </h1>
                {h.organizer && (
                  <p className="text-base text-muted-foreground font-medium">
                    Organized by <span className="text-foreground">{h.organizer}</span>
                  </p>
                )}
              </div>

              {/* Action Buttons: Web, Calendar, Bookmark, Share */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share hackathon"
                  className="grid h-9 w-9 place-items-center rounded-full glass text-muted-foreground hover:text-foreground transition"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleToggleSave}
                  aria-label="Bookmark hackathon"
                  className={`grid h-9 w-9 place-items-center rounded-full glass transition ${
                    saved ? "text-red-400" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
                </button>
                <a
                  href={h.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Official website"
                  className="grid h-9 w-9 place-items-center rounded-full glass text-muted-foreground hover:text-gold transition"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Team Size & Prize Row (Unstop style) */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="clay rounded-2xl p-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-gold">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Team Size</p>
                  <p className="font-semibold text-sm">1 - 4 Members</p>
                </div>
              </div>

              <div className="clay rounded-2xl p-4 flex items-center gap-3 border border-emerald-500/20 bg-emerald-500/5">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Prizes Worth</p>
                  <p className="font-bold text-base text-foreground">{prizeDisplay}</p>
                </div>
              </div>
            </div>

            {/* Tags / Categories */}
            {!!h.tags.length && (
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="neo-inset rounded-full px-3 py-1 text-xs text-muted-foreground">
                  Everyone can apply
                </span>
                {h.tags.map((t) => (
                  <span key={t} className="rounded-full bg-accent/70 px-3 py-1 text-xs text-accent-foreground font-medium">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* TAB 1 & OVERVIEW: Stages and Timelines (Unstop Style, Image 2) */}
          {(activeTab === "overview" || activeTab === "timeline") && (
            <section className="glass rounded-[2rem] p-6 sm:p-8 space-y-6 border border-glass-border">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gold" /> Stages and Timelines
              </h2>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-glass-border">
                {/* Stage 1 */}
                <div className="relative space-y-2">
                  <div className="absolute -left-[27px] sm:-left-[35px] top-1 h-5 w-5 rounded-full border-2 border-gold bg-background grid place-items-center">
                    <span className="h-2 w-2 rounded-full bg-gold" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-gold/15 px-2 py-0.5 font-mono text-[11px] font-bold text-gold">
                      Round 1
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {datesLabel(h) || "Ongoing Submission Period"}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold">
                    Idea Submission & Architecture Blueprint
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Submit your team proposal, problem statement choice, and system architecture. Shortlisted teams qualify for mentor reviews.
                  </p>
                </div>

                {/* Stage 2 */}
                <div className="relative space-y-2">
                  <div className="absolute -left-[27px] sm:-left-[35px] top-1 h-5 w-5 rounded-full border-2 border-glass-border bg-background grid place-items-center">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-accent px-2 py-0.5 font-mono text-[11px] font-bold text-accent-foreground">
                      Round 2
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">Mid-way Milestone Check</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold">
                    Prototype Development & Code Review
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Working GitHub repository check with preliminary demo video. Technical mentorship sessions provided to refine the solution.
                  </p>
                </div>

                {/* Stage 3 */}
                <div className="relative space-y-2">
                  <div className="absolute -left-[27px] sm:-left-[35px] top-1 h-5 w-5 rounded-full border-2 border-glass-border bg-background grid place-items-center">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-accent px-2 py-0.5 font-mono text-[11px] font-bold text-accent-foreground">
                      Grand Finale
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">Demo Day</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold">
                    Live Pitch Presentation & Winner Announcement
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Final project demo in front of jury, venture scouts, and technology leads. Prize distribution and networking.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* TAB 2: Details & Rules */}
          {(activeTab === "overview" || activeTab === "details") && (
            <section className="glass rounded-[2rem] p-6 sm:p-8 space-y-6 border border-glass-border">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-gold" /> Details & Guidelines
              </h2>

              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  {h.description ||
                    `${h.title} invites builders, designers, and software engineers to innovate, prototype, and build high-impact applications.`}
                </p>

                <div className="clay rounded-2xl p-5 space-y-3">
                  <h3 className="font-bold text-foreground text-sm uppercase tracking-wider font-mono">
                    Eligibility Criteria
                  </h3>
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-foreground/80">
                    <li>Open to all engineering, polytechnic, and university students across India.</li>
                    <li>Inter-college and cross-specialization teams of 1 to 4 members are encouraged.</li>
                    <li>Projects must be freshly coded during the official hackathon duration.</li>
                    <li>Thapar Institute participants can apply for Duty Leave (OD) upon team verification.</li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* TAB 3: Prizes & Rewards */}
          {(activeTab === "overview" || activeTab === "prizes") && (
            <section className="glass rounded-[2rem] p-6 sm:p-8 space-y-6 border border-glass-border">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-gold" /> Prizes & Recognition
              </h2>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="clay rounded-2xl p-4 text-center space-y-2 border border-gold/40">
                  <span className="inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-mono font-bold text-gold">
                    1st Place (Winner)
                  </span>
                  <p className="text-2xl font-bold text-foreground">{h.prize || "₹ 1,00,000"}</p>
                  <p className="text-[11px] text-muted-foreground">Trophy, Winner Certificate, Cloud Credits & Swag</p>
                </div>

                <div className="clay rounded-2xl p-4 text-center space-y-2">
                  <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-mono font-bold text-accent-foreground">
                    1st Runner Up
                  </span>
                  <p className="text-xl font-bold text-foreground">₹ 50,000</p>
                  <p className="text-[11px] text-muted-foreground">Runner-up Trophy, Certificates & Sponsor Swags</p>
                </div>

                <div className="clay rounded-2xl p-4 text-center space-y-2">
                  <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-mono font-bold text-accent-foreground">
                    Best Beginner Hack
                  </span>
                  <p className="text-xl font-bold text-foreground">₹ 25,000</p>
                  <p className="text-[11px] text-muted-foreground">Special track for 1st & 2nd year students</p>
                </div>
              </div>
            </section>
          )}

          {/* TAB 4: Reviews & FAQs */}
          {(activeTab === "reviews" || activeTab === "faqs") && (
            <section className="glass rounded-[2rem] p-6 sm:p-8 space-y-6 border border-glass-border">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gold" /> Community & FAQs
              </h2>

              <div className="space-y-3 text-xs">
                {[
                  {
                    q: "Is there any registration fee to participate?",
                    a: "No! HackHub only curates free and verified student hackathons.",
                  },
                  {
                    q: "Can I participate individually without a team?",
                    a: "Yes! You can register solo or use HackHub's Team Builder to find co-builders with matching skills.",
                  },
                  {
                    q: "How do I get On-Duty (OD) leave at Thapar for this hackathon?",
                    a: "After registering, submit your team details on HackHub. Official verified events provide an exportable OD attendance slip for DoSA approval.",
                  },
                ].map((faq, i) => (
                  <div key={i} className="clay rounded-2xl p-4 space-y-1.5">
                    <p className="font-bold text-foreground text-sm flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-gold shrink-0" /> {faq.q}
                    </p>
                    <p className="text-muted-foreground pl-6">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Sticky Sidebar (Exact copy of Unstop Image 2) */}
        <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
          {/* Main Registration Box */}
          <div className="clay rounded-[2rem] p-6 border border-glass-border space-y-4">
            {dl && (
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground">Registration closes</span>
                <span className="text-gold font-bold">{dl}</span>
              </div>
            )}

            {/* User status */}
            <div className="rounded-2xl bg-muted/30 p-3 flex items-center gap-3 border border-glass-border/40">
              <div className="clay h-9 w-9 rounded-full overflow-hidden shrink-0 grid place-items-center">
                {user ? (
                  <span className="font-mono text-xs font-bold text-gold">
                    {user.email?.slice(0, 2).toUpperCase()}
                  </span>
                ) : (
                  <Users className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1 text-xs">
                <p className="text-muted-foreground text-[10px]">Please register as:</p>
                <p className="font-medium text-foreground truncate">
                  {user?.email || "Sign in to auto-fill details"}
                </p>
              </div>
            </div>

            {/* Primary Action Button */}
            <Button variant="gold" size="lg" className="w-full text-base font-bold shadow-lg" asChild>
              <a href={h.url} target="_blank" rel="noreferrer">
                Register on {h.source} <ArrowUpRight className="h-4 w-4 ml-1" />
              </a>
            </Button>

            {/* Teammates CTA */}
            <Button variant="glass" size="sm" className="w-full rounded-full" asChild>
              <Link to="/team-builder" search={{ post: undefined }}>
                <Users className="h-3.5 w-3.5 mr-1.5 text-gold" /> Find Teammates for this Hack
              </Link>
            </Button>

            {/* Registration Counter */}
            <div className="pt-2 text-center text-xs font-mono text-muted-foreground flex items-center justify-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-gold" />
              <span>{h.participants ? h.participants.toLocaleString("en-IN") : "350+"} Students Registered</span>
            </div>
          </div>

          {/* Share with Friends Card (Image 2 style) */}
          <div className="glass rounded-[2rem] p-5 space-y-3 border border-glass-border/70">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">Share with Friends</span>
              <Button variant="gold" size="sm" onClick={handleShare} className="rounded-full h-8 text-xs gap-1">
                <Share2 className="h-3 w-3" /> Refer now
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Invite your classmates to form a team and increase your odds of winning.
            </p>
          </div>

          {/* AI Fit Intelligence Card */}
          <div className="glass rounded-[2rem] p-6 space-y-4 border border-gold/30">
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gold font-semibold">
              <Sparkles className="h-4 w-4" /> Your AI Fit Score
            </p>

            {!user ? (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Sign in with your @thapar.edu account to calculate your personal skills match.
                </p>
                <Button className="w-full" variant="gold" size="sm" asChild>
                  <Link to="/auth">Sign in with Thapar ID</Link>
                </Button>
              </div>
            ) : fit.isPending ? (
              <div className="space-y-3">
                <div className="neo-inset h-16 animate-pulse rounded-2xl" />
                <p className="text-xs text-muted-foreground">Comparing your Developer DNA against this challenge…</p>
              </div>
            ) : fit.data ? (
              <div className="space-y-3">
                <div className="flex items-end gap-2">
                  <span className="font-display text-5xl font-bold text-gold-gradient">{fit.data.score}</span>
                  <span className="pb-1 font-mono text-xs text-muted-foreground">/ 100 match</span>
                </div>
                <div className="neo-inset h-2 overflow-hidden rounded-full">
                  <div className="h-full bg-gold-gradient" style={{ width: `${fit.data.score}%` }} />
                </div>
                <p className="text-sm font-semibold text-foreground">{fit.data.verdict}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{fit.data.summary}</p>
                <Button variant="ghost" size="sm" className="text-xs h-7 px-2" onClick={() => fit.mutate(true)}>
                  Re-evaluate
                </Button>
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
