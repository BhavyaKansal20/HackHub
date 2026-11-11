import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession, SKILL_SUGGESTIONS } from "@/lib/session";
import { hackathonsQuery } from "@/lib/hackathons";
import { TagInput } from "@/components/hub/TagInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/team-builder")({
  validateSearch: (s: Record<string, unknown>) => ({ post: typeof s["post"] === "string" ? (s["post"] as string) : undefined }),
  head: () => ({ meta: [
    { title: "Team Builder — HackHub" },
    { name: "description", content: "Post what your team needs and get matched with skilled Thapar teammates instantly." },
    { property: "og:title", content: "Team Builder — HackHub" },
    { property: "og:description", content: "Find teammates with the exact skills your hackathon team needs." },
  ] }),
  component: TeamBuilder,
});

const postSchema = z.object({
  title: z.string().trim().min(3).max(140),
  description: z.string().trim().min(10).max(3000),
  skills_needed: z.array(z.string()).min(1, "Add at least one skill"),
  roles_needed: z.array(z.string()).max(10),
  spots: z.coerce.number().int().min(1).max(10),
  commitment: z.string().max(100).default(""),
  hackathon_id: z.string().uuid().nullable(),
});

function TeamBuilder() {
  const { user } = useSession();
  const { post: focus } = Route.useSearch();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"all" | "mine">("all");
  const posts = useQuery({
    queryKey: ["team-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("team_posts")
        .select("*, owner:profiles!team_posts_owner_id_fkey(id,full_name,avatar_url,branch,current_year,headline,skills,linkedin_url,github_url), hackathon:hackathons(id,title)")
        .order("created_at", { ascending: false }).limit(100);
      if (error) throw error;
      return data;
    },
  });
  const myInterests = useQuery({
    queryKey: ["my-interests", user?.id], enabled: !!user,
    queryFn: async () => (await supabase.from("team_interests").select("*").eq("user_id", user!.id)).data ?? [],
  });
  const interest = useMutation({
    mutationFn: async ({ post_id, message }: { post_id: string; message: string }) => {
      const { error } = await supabase.from("team_interests").insert({ post_id, user_id: user!.id, message: message.slice(0, 1000) || null });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Interest sent — the team lead has been notified"); qc.invalidateQueries({ queryKey: ["my-interests"] }); },
    onError: (e) => toast.error((e as Error).message),
  });

  const list = (posts.data ?? []).filter((p) => (tab === "mine" ? p.owner_id === user?.id : true))
    .sort((a, b) => Number(b.id === focus) - Number(a.id === focus));
  return (
    <div className="mt-6">
      <div className="glass flex flex-col items-start justify-between gap-4 rounded-[2rem] p-8 md:flex-row md:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-gold">Team Builder</p>
          <h1 className="text-4xl font-bold md:text-5xl">Stop begging on WhatsApp.</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">Post what your team needs. Everyone whose skills match is notified the same second.</p>
        </div>
        <Button variant="gold" size="lg" onClick={() => setOpen(true)}><Plus /> Post a team call</Button>
      </div>
      <div className="mt-6 flex gap-2">
        <Button size="sm" variant={tab === "all" ? "gold" : "glass"} onClick={() => setTab("all")}>All calls</Button>
        <Button size="sm" variant={tab === "mine" ? "gold" : "glass"} onClick={() => setTab("mine")}>My posts</Button>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {posts.isLoading && <div className="glass h-56 animate-pulse rounded-[2rem]" />}
        {list.map((p) => (
          <PostCard key={p.id} p={p as any} me={user?.id} focused={p.id === focus}
            interested={myInterests.data?.find((i) => i.post_id === p.id)}
            onInterest={(message) => interest.mutate({ post_id: p.id, message })} />
        ))}
        {!posts.isLoading && !list.length && <p className="text-muted-foreground">No team calls yet. Be the first.</p>}
      </div>
      <NewPost open={open} onOpenChange={setOpen} userId={user?.id} />
    </div>
  );
}

function PostCard({ p, me, focused, interested, onInterest }: { p: any; me: string | undefined; focused: boolean; interested: any; onInterest: (m: string) => void }) {
  const [msg, setMsg] = useState("");
  const mine = p.owner_id === me;
  return (
    <article className={`glass rounded-[2rem] p-6 ${focused ? "ring-2 ring-gold" : ""}`}>
      <div className="flex items-center gap-3">
        {p.owner?.avatar_url ? <img src={p.owner.avatar_url} alt="" className="h-12 w-12 rounded-2xl object-cover" /> : <div className="clay h-12 w-12 rounded-2xl" />}
        <div className="min-w-0">
          <p className="font-semibold">{p.owner?.full_name ?? "Thapar student"}</p>
          <p className="truncate text-sm text-muted-foreground">{p.owner?.branch} · Year {p.owner?.current_year}</p>
        </div>
        <span className={`ml-auto rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase ${p.status === "open" ? "bg-accent text-accent-foreground" : "neo-inset"}`}>{p.status}</span>
      </div>
      <h3 className="mt-4 text-2xl font-semibold">{p.title}</h3>
      {p.hackathon && <Link to="/hackathons/$id" params={{ id: p.hackathon.id }} className="font-mono text-xs text-gold hover:underline">for {p.hackathon.title}</Link>}
      <p className="mt-2 whitespace-pre-line text-muted-foreground">{p.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">{p.skills_needed.map((s: string) => <span key={s} className="rounded-full bg-accent px-2.5 py-0.5 text-sm text-accent-foreground">{s}</span>)}
        {p.roles_needed.map((s: string) => <span key={s} className="neo-inset rounded-full px-2.5 py-0.5 text-sm">{s}</span>)}</div>
      <p className="mt-3 font-mono text-xs text-muted-foreground">{p.spots} spot{p.spots > 1 ? "s" : ""}{p.commitment ? ` · ${p.commitment}` : ""}</p>
      <div className="mt-4 flex flex-wrap gap-3 font-mono text-xs">
        {p.owner?.linkedin_url && <a href={p.owner.linkedin_url} target="_blank" rel="noreferrer" className="text-gold hover:underline">LinkedIn</a>}
        {p.owner?.github_url && <a href={p.owner.github_url} target="_blank" rel="noreferrer" className="text-gold hover:underline">GitHub</a>}
      </div>
      {mine ? <OwnerPanel postId={p.id} status={p.status} /> : interested ? (
        <div className="clay mt-5 rounded-3xl p-4 text-sm">
          {interested.status === "accepted" ? (
            <div><p className="flex items-center gap-2 font-semibold text-success"><UserCheck className="h-4 w-4" /> You're in! Reach out:</p>
              {Object.entries(interested.shared_contact ?? {}).map(([k, v]) => <p key={k} className="mt-1 font-mono">{k}: {String(v)}</p>)}</div>
          ) : interested.status === "declined" ? <p className="text-muted-foreground">The team lead passed this time.</p> : <p className="text-muted-foreground">Interest sent. Waiting for the team lead.</p>}
        </div>
      ) : p.status === "open" ? (
        <div className="mt-5 flex gap-2">
          <Input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Short note (optional)" className="neo-inset h-10 rounded-full border-0" />
          <Button variant="gold" onClick={() => onInterest(msg)}>Interested</Button>
        </div>
      ) : null}
    </article>
  );
}

function OwnerPanel({ postId, status }: { postId: string; status: string }) {
  const qc = useQueryClient();
  const [sharing, setSharing] = useState<any>(null);
  const q = useQuery({
    queryKey: ["interests", postId],
    queryFn: async () => (await supabase.from("team_interests").select("*, user:profiles!team_interests_user_id_fkey(full_name,avatar_url,branch,current_year,skills,linkedin_url,github_url)").eq("post_id", postId).order("created_at")).data ?? [],
  });
  const toggle = useMutation({
    mutationFn: async () => { await supabase.from("team_posts").update({ status: status === "open" ? "closed" : "open" }).eq("id", postId); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["team-posts"] }),
  });
  const del = useMutation({
    mutationFn: async () => { await supabase.from("team_posts").delete().eq("id", postId); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["team-posts"] }); toast.success("Post removed"); },
  });
  const decline = async (id: string) => { await supabase.from("team_interests").update({ status: "declined" }).eq("id", id); q.refetch(); };
  return (
    <div className="mt-5 space-y-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{q.data?.length ?? 0} interested</p>
      {q.data?.map((i: any) => (
        <div key={i.id} className="clay flex items-center gap-3 rounded-3xl p-3">
          {i.user?.avatar_url ? <img src={i.user.avatar_url} alt="" className="h-10 w-10 rounded-xl object-cover" /> : <div className="neo-inset h-10 w-10 rounded-xl" />}
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{i.user?.full_name}</p>
            <p className="truncate text-xs text-muted-foreground">{i.user?.skills?.slice(0, 5).join(" · ")}</p>
            {i.message && <p className="text-sm">“{i.message}”</p>}
          </div>
          {i.status === "pending" ? (
            <div className="flex gap-1"><Button size="sm" variant="gold" onClick={() => setSharing(i)}>Accept</Button><Button size="sm" variant="ghost" onClick={() => decline(i.id)}>Pass</Button></div>
          ) : <span className="font-mono text-xs text-muted-foreground">{i.status}</span>}
        </div>
      ))}
      <div className="flex gap-2"><Button size="sm" variant="glass" onClick={() => toggle.mutate()}>{status === "open" ? "Close post" : "Reopen"}</Button>
        <Button size="sm" variant="ghost" onClick={() => confirm("Delete this post?") && del.mutate()}>Delete</Button></div>
      <ShareDialog interest={sharing} onClose={() => { setSharing(null); q.refetch(); }} />
    </div>
  );
}

function ShareDialog({ interest, onClose }: { interest: any; onClose: () => void }) {
  const { user } = useSession();
  const [pick, setPick] = useState({ email: true, phone: false, linkedin: true });
  const [phone, setPhone] = useState("");
  async function send(): Promise<void> {
    const contact: Record<string, string> = {};
    if (pick.email && user?.email) contact["Email"] = user.email;
    if (pick.phone) { if (!/^\+?[0-9 ]{10,15}$/.test(phone)) { toast.error("Enter a valid phone number"); return; } contact["Phone"] = phone; }
    if (pick.linkedin) { const { data } = await supabase.from("profiles").select("linkedin_url").eq("id", user!.id).single(); if (data?.linkedin_url) contact["LinkedIn"] = data.linkedin_url; }
    if (!Object.keys(contact).length) { toast.error("Share at least one way to reach you"); return; }
    const { error } = await supabase.from("team_interests").update({ status: "accepted", shared_contact: contact }).eq("id", interest.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Accepted — they've been notified with your contact"); onClose();
  }
  return (
    <Dialog open={!!interest} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="glass rounded-[2rem] border-glass-border">
        <DialogHeader><DialogTitle className="font-display text-3xl">Share how to reach you</DialogTitle></DialogHeader>
        <p className="text-muted-foreground">Only {interest?.user?.full_name} will see what you choose.</p>
        <div className="space-y-3">
          {(["email", "linkedin", "phone"] as const).map((k) => (
            <label key={k} className="clay flex items-center gap-3 rounded-full px-4 py-2 capitalize">
              <input type="checkbox" checked={pick[k]} onChange={(e) => setPick({ ...pick, [k]: e.target.checked })} className="accent-[var(--gold)]" /> {k}
            </label>
          ))}
          {pick.phone && <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98xxxxxxx" className="neo-inset h-10 rounded-full border-0" />}
        </div>
        <Button variant="gold" onClick={send}>Accept & share</Button>
      </DialogContent>
    </Dialog>
  );
}

function NewPost({ open, onOpenChange, userId }: { open: boolean; onOpenChange: (o: boolean) => void; userId: string | undefined }) {
  const qc = useQueryClient();
  const hacks = useQuery(hackathonsQuery());
  const [f, setF] = useState({ title: "", description: "", skills_needed: [] as string[], roles_needed: [] as string[], spots: "2", commitment: "", hackathon_id: "" });
  const create = useMutation({
    mutationFn: async () => {
      const parsed = postSchema.safeParse({ ...f, hackathon_id: f.hackathon_id || null });
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid");
      const { error } = await supabase.from("team_posts").insert({ ...parsed.data, owner_id: userId! });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Published — matching students are being notified"); onOpenChange(false); qc.invalidateQueries({ queryKey: ["team-posts"] });
      setF({ title: "", description: "", skills_needed: [], roles_needed: [], spots: "2", commitment: "", hackathon_id: "" }); },
    onError: (e) => toast.error((e as Error).message),
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-h-[90vh] overflow-y-auto rounded-[2rem] border-glass-border sm:max-w-xl">
        <DialogHeader><DialogTitle className="font-display text-3xl">Post a team call</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <select value={f.hackathon_id} onChange={(e) => setF({ ...f, hackathon_id: e.target.value })} className="neo-inset h-10 w-full rounded-full border-0 px-4">
            <option value="">Which hackathon? (optional)</option>
            {hacks.data?.map((h) => <option key={h.id} value={h.id}>{h.title}</option>)}
          </select>
          <Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Need an ML engineer for HackTU" className="neo-inset h-10 rounded-full border-0" />
          <Textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} rows={4} placeholder="What you're building, what the teammate will own…" className="neo-inset rounded-3xl border-0" />
          <div><p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Skills needed</p><TagInput value={f.skills_needed} onChange={(v) => setF({ ...f, skills_needed: v })} suggestions={SKILL_SUGGESTIONS} placeholder="e.g. PyTorch" /></div>
          <div><p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Roles</p><TagInput value={f.roles_needed} onChange={(v) => setF({ ...f, roles_needed: v })} suggestions={["Frontend", "Backend", "ML Engineer", "Designer", "Pitch Lead", "Hardware"]} placeholder="e.g. Designer" /></div>
          <div className="grid grid-cols-2 gap-3">
            <Input type="number" min={1} max={10} value={f.spots} onChange={(e) => setF({ ...f, spots: e.target.value })} placeholder="Spots" className="neo-inset h-10 rounded-full border-0" />
            <Input value={f.commitment} onChange={(e) => setF({ ...f, commitment: e.target.value })} placeholder="Weekends, 36h offline…" className="neo-inset h-10 rounded-full border-0" />
          </div>
          <Button variant="gold" className="w-full" disabled={create.isPending} onClick={() => create.mutate()}>{create.isPending ? "Publishing…" : "Publish & notify matches"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
