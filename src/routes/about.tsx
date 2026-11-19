import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import {
  Sparkles,
  ShieldCheck,
  Users,
  Compass,
  Trophy,
  Cpu,
  Mail,
  ArrowRight,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead(
      "About Us — HackHub | Built for Thapar Builders",
      "The institutional hackathon horizon finder, AI skill blueprint engine, and squad matchmaking platform for Thapar Institute of Engineering & Technology.",
      "/about",
    ),
  component: AboutPage,
});

function AboutPage() {
  return (
    <article className="mx-auto max-w-4xl py-8 space-y-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] glass px-6 py-12 text-center md:px-12 md:py-16">
        <img
          src="/HackHubLogo.svg"
          alt="HackHub"
          className="mx-auto mb-6 h-24 sm:h-28 w-auto object-contain drop-shadow-2xl"
        />
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-gold">
          Thapar Institute of Engineering & Technology · Patiala
        </p>
        <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-bold leading-tight sm:text-6xl">
          Empowering the <span className="text-gold-gradient">Next Generation</span> of Builders
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground leading-relaxed">
          HackHub is an independent institutional platform engineered specifically for students,
          hackers, and innovators at Thapar. We unify scattered competition horizons, calculate
          instant AI skill-fit scores, and connect multidisciplinary minds into championship squads.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="gold" size="sm" asChild>
            <Link to="/">
              Explore Hackathons <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
          </Button>
          <Button variant="glass" size="sm" asChild>
            <Link to="/team-builder" search={{ post: undefined }}>
              <Users className="h-4 w-4 mr-1.5" /> Find Teammates
            </Link>
          </Button>
        </div>
      </div>

      {/* The Story & Mission */}
      <section className="clay rounded-[2rem] p-8 md:p-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">The HackHub Story</h2>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              From Campus Problem to Universal Solution
            </p>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Every semester, thousands of world-class hackathons, coding championships, and case
          competitions launch across Unstop, Devpost, Devfolio, MLH, and internal university societies.
          Yet, talented students at Thapar often missed out—either because registrations expired before
          they noticed, announcements were buried in chaotic WhatsApp group chats, or developers could
          not find complementary designers, pitch leads, or AI researchers to complete a squad.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          <strong className="text-foreground">HackHub was born to eradicate that barrier.</strong> By
          aggregating live hackathons into a single, high-fidelity poster interface, calculating
          personalized AI Fit Scores using institutional skills blueprints, and enforcing strict
          <code className="mx-1 rounded bg-accent/60 px-1.5 py-0.5 font-mono text-xs text-gold">
            @thapar.edu
          </code>
          authentication, we ensure every builder can find their arena and conquer it.
        </p>
      </section>

      {/* Core Pillars Grid */}
      <section className="space-y-6">
        <h2 className="text-center font-display text-3xl font-bold">
          The Four Pillars of <span className="text-gold-gradient">HackHub</span>
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Pillar 1 */}
          <div className="glass rounded-[2rem] p-6 space-y-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/20 text-gold">
              <Trophy className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">Universal Aggregation</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Curated feeds synced from Devpost, Devfolio, Unstop, HackerEarth, and TIET Flagship
              society competitions. Never miss a registration window or prize pool again.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="glass rounded-[2rem] p-6 space-y-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/20 text-gold">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">AI Skills Blueprint</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our intelligent engine analyzes your GitHub, technical proficiencies, and graduation year
              to generate a personalized fit score for each competition, highlighting areas to shine.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="glass rounded-[2rem] p-6 space-y-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/20 text-gold">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">Squad Matchmaking</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Filter by specific domain needs (Frontend, AI/ML, Smart Contracts, UI/UX, Pitch).
              Send 1-click team invites and inspect candidate blueprints before locking in rosters.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="glass rounded-[2rem] p-6 space-y-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/20 text-gold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">Verified Institutional Trust</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No anonymous bots or external spam. Every member is verified via institutional Google
              OAuth, creating a safe, accountable, and high-trust campus collaboration network.
            </p>
          </div>
        </div>
      </section>

      {/* Technology & Design System */}
      <section className="clay rounded-[2rem] p-8 md:p-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Engineering & Design Philosophy</h2>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              Obsidian Glassmorphism & Modern Full-Stack Speed
            </p>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          HackHub is engineered with TanStack Start, React 19, Vite, Tailwind CSS, and Supabase.
          Every component reflects our signature design language: deep obsidian backgrounds,
          delicate glass borders, clay elevation, and lustrous royal gold highlights.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="glass rounded-xl p-4">
            <p className="font-mono text-xl font-bold text-gold">100%</p>
            <p className="text-xs text-muted-foreground mt-1">Verified Thapar IDs</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="font-mono text-xl font-bold text-gold">Sub-100ms</p>
            <p className="text-xs text-muted-foreground mt-1">Search & Filtering</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="font-mono text-xl font-bold text-gold">AI-Driven</p>
            <p className="text-xs text-muted-foreground mt-1">Blueprint Engine</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="font-mono text-xl font-bold text-gold">RLS-Backed</p>
            <p className="text-xs text-muted-foreground mt-1">Row Level Security</p>
          </div>
        </div>
      </section>

      {/* Connect & Contact */}
      <section className="glass rounded-[2rem] p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold">Built with Passion for TIET</h2>
        <p className="mx-auto max-w-lg text-sm text-muted-foreground">
          HackHub is an independent, student-driven initiative. Have suggestions, want to list your
          society’s flagship event, or want to contribute to the codebase?
        </p>
        <div className="pt-2">
          <a
            href="mailto:multimodexai@gmail.com"
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-6 py-2.5 text-sm font-medium text-gold hover:bg-gold/20 transition"
          >
            <Mail className="h-4 w-4" /> multimodexai@gmail.com
          </a>
        </div>
      </section>
    </article>
  );
}
