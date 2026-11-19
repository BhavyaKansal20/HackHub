import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Bell, LogOut, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/session";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { user, ready } = useSession();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const unread = useQuery({
    queryKey: ["unread", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { count } = await supabase.from("notifications").select("id", { count: "exact", head: true }).eq("read", false);
      return count ?? 0;
    },
  });
  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel(`notif-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, () => {
        qc.invalidateQueries({ queryKey: ["unread"] });
        qc.invalidateQueries({ queryKey: ["notifications"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, qc]);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [navigate]);

  async function signOut() {
    setMobileOpen(false);
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const nav = "rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground";
  const active = { className: "rounded-full px-3 py-1.5 text-sm text-foreground bg-accent/60" };
  const mobileNav = "block w-full rounded-2xl px-5 py-3.5 text-left text-base text-muted-foreground transition hover:bg-accent/40 hover:text-foreground";
  const mobileActive = { className: "block w-full rounded-2xl px-5 py-3.5 text-left text-base text-foreground bg-accent/60" };

  return (
    <>
      <header className="sticky top-0 z-40 px-4 pt-4">
        <div className="glass mx-auto flex max-w-6xl items-center gap-2 rounded-full px-4 py-2">
          <Link to="/" className="mr-3 flex items-center gap-3 font-display text-2xl font-bold tracking-tight" onClick={() => setMobileOpen(false)}>
            <img src="/HackHubLogo.png" alt="HackHub" className="h-10 sm:h-12 w-auto object-contain shrink-0 drop-shadow-sm" />
            <span>Hack<span className="text-gold-gradient">Hub</span></span>
          </Link>
          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            <Link to="/" className={nav} activeProps={active} activeOptions={{ exact: true }}>Hackathons</Link>
            <Link to="/team-builder" search={{ post: undefined }} className={nav} activeProps={active}>Team Builder</Link>
            <Link to="/profile" className={nav} activeProps={active}>My Blueprint</Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {ready && user ? (
              <>
                <Link to="/notifications" className="relative grid h-9 w-9 place-items-center rounded-full glass" aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                  {!!unread.data && (
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold-gradient px-1 font-mono text-[10px] text-primary-foreground">
                      {unread.data}
                    </span>
                  )}
                </Link>
                <Button variant="glass" size="icon" onClick={signOut} aria-label="Sign out" className="hidden md:inline-flex"><LogOut /></Button>
              </>
            ) : ready ? (
              <Button variant="gold" size="sm" asChild className="hidden md:inline-flex"><Link to="/auth">Sign in with Thapar ID</Link></Button>
            ) : null}
            {/* Hamburger button — mobile only */}
            <button
              className="grid h-9 w-9 place-items-center rounded-full glass md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <nav
        className={`fixed left-4 right-4 top-[76px] z-40 glass rounded-[2rem] p-4 transition-all duration-200 md:hidden ${mobileOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
      >
        <div className="flex flex-col gap-1">
          <Link to="/" className={mobileNav} activeProps={mobileActive} activeOptions={{ exact: true }} onClick={() => setMobileOpen(false)}>Hackathons</Link>
          <Link to="/team-builder" search={{ post: undefined }} className={mobileNav} activeProps={mobileActive} onClick={() => setMobileOpen(false)}>Team Builder</Link>
          <Link to="/profile" className={mobileNav} activeProps={mobileActive} onClick={() => setMobileOpen(false)}>My Blueprint</Link>
          <Link to="/about" className={mobileNav} activeProps={mobileActive} onClick={() => setMobileOpen(false)}>About Us</Link>
          {ready && user && (
            <Link to="/notifications" className={mobileNav} activeProps={mobileActive} onClick={() => setMobileOpen(false)}>
              Notifications{!!unread.data && <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-gradient px-1 font-mono text-[10px] text-primary-foreground">{unread.data}</span>}
            </Link>
          )}
          <div className="mt-2 border-t border-glass-border pt-2">
            {ready && user ? (
              <button className={`${mobileNav} flex w-full items-center gap-2 text-destructive hover:text-destructive`} onClick={signOut}>
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            ) : ready ? (
              <Link to="/auth" className={`${mobileNav} text-gold`} onClick={() => setMobileOpen(false)}>Sign in with Thapar ID →</Link>
            ) : null}
          </div>
        </div>
      </nav>
    </>
  );
}
