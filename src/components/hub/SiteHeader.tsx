import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Bell, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/session";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { user, ready } = useSession();
  const qc = useQueryClient();
  const navigate = useNavigate();
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

  async function signOut() {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const nav = "rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground";
  const active = { className: "rounded-full px-3 py-1.5 text-sm text-foreground bg-accent/60" };
  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <div className="glass mx-auto flex max-w-6xl items-center gap-2 rounded-full px-4 py-2">
        <Link to="/" className="mr-3 font-display text-2xl font-bold tracking-tight">
          Hack<span className="text-gold-gradient">Hub</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
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
              <Button variant="glass" size="icon" onClick={signOut} aria-label="Sign out"><LogOut /></Button>
            </>
          ) : ready ? (
            <Button variant="gold" size="sm" asChild><Link to="/auth">Sign in with Thapar ID</Link></Button>
          ) : null}
        </div>
      </div>
      <nav className="mx-auto mt-2 flex max-w-6xl justify-center gap-1 md:hidden">
        <Link to="/" className={nav} activeProps={active} activeOptions={{ exact: true }}>Hackathons</Link>
        <Link to="/team-builder" search={{ post: undefined }} className={nav} activeProps={active}>Teams</Link>
        <Link to="/profile" className={nav} activeProps={active}>Blueprint</Link>
      </nav>
    </header>
  );
}
