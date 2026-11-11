import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({ meta: [
    { title: "Notifications — HackHub" },
    { name: "description", content: "Team matches, interest requests and accepted invitations." },
    { property: "og:title", content: "Notifications — HackHub" },
    { property: "og:description", content: "Your HackHub activity." },
  ] }),
  component: Notifications,
});

function Notifications() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => (await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(100)).data ?? [],
  });
  const refresh = () => { qc.invalidateQueries({ queryKey: ["notifications"] }); qc.invalidateQueries({ queryKey: ["unread"] }); };
  const markAll = async () => { await supabase.from("notifications").update({ read: true }).eq("read", false); refresh(); };
  const open = async (id: string) => { await supabase.from("notifications").update({ read: true }).eq("id", id); refresh(); };
  return (
    <div className="mx-auto mt-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-5xl font-bold">Notifications</h1>
        <Button variant="glass" size="sm" onClick={markAll}>Mark all read</Button>
      </div>
      <div className="mt-6 space-y-3">
        {isLoading && <div className="glass h-24 animate-pulse rounded-[2rem]" />}
        {!isLoading && !data.length && <p className="glass rounded-[2rem] p-8 text-center text-muted-foreground">Nothing yet. When someone needs your skills, you'll hear here first.</p>}
        {data.map((n) => {
          const post = n.link?.split("post=")[1];
          return (
            <Link key={n.id} to="/team-builder" search={{ post }} onClick={() => open(n.id)}
              className={`glass flex items-start gap-4 rounded-[1.75rem] p-5 transition hover:border-gold/40 ${n.read ? "opacity-70" : ""}`}>
              <span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${n.read ? "bg-muted" : "bg-gold-gradient"}`} />
              <div className="flex-1">
                <p className="text-lg font-semibold">{n.title}</p>
                {n.body && <p className="text-muted-foreground">{n.body}</p>}
              </div>
              <span className="font-mono text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
