import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Camera, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { evaluateProfile, type Blueprint } from "@/lib/hub.functions";
import { SKILL_SUGGESTIONS } from "@/lib/session";
import { compressPhoto } from "@/lib/safety";
import { TagInput } from "@/components/hub/TagInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [
    { title: "My blueprint — HackHub" },
    { name: "description", content: "Your Thapar profile, skills and AI-evaluated blueprint." },
    { property: "og:title", content: "My blueprint — HackHub" },
    { property: "og:description", content: "Your AI-evaluated skills blueprint." },
  ] }),
  component: ProfilePage,
});

const url = z.string().trim().url().max(300);
const schema = z.object({
  persona: z.enum(["student", "faculty", "phd_scholar", "researcher"]),
  full_name: z.string().trim().min(2).max(100),
  gender: z.string().min(1, "Pick a gender"),
  avatar_url: z.string().min(1, "Add a profile photo"),
  university: z.string().trim().min(2).max(150),
  roll_no: z.string().trim().min(3).max(30),
  branch: z.string().trim().min(2).max(100),
  current_year: z.coerce.number().int().min(1).max(6),
  graduating_year: z.coerce.number().int().min(2024).max(2040),
  linkedin_url: url.refine((v) => /linkedin\.com\//i.test(v), "Must be a LinkedIn link"),
  github_url: url.refine((v) => /github\.com\//i.test(v), "Must be a GitHub link"),
  portfolio_url: z.union([url, z.literal("")]).default(""),
  headline: z.string().trim().max(120).default(""),
  bio: z.string().trim().max(1500).default(""),
  experience: z.string().trim().max(3000).default(""),
  skills: z.array(z.string().max(40)).min(3, "Add at least 3 skills"),
  interests: z.array(z.string().max(40)).max(20),
});
type Form = z.input<typeof schema>;

const PERSONAS = [["student", "Student"], ["faculty", "Faculty"], ["phd_scholar", "PhD scholar"], ["researcher", "Researcher"]] as const;

function ProfilePage() {
  const qc = useQueryClient();
  const evalFn = useServerFn(evaluateProfile);
  const { data: p, isLoading } = useQuery({
    queryKey: ["profile-me"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data } = await supabase.from("profiles").select("id,persona,full_name,gender,avatar_url,university,roll_no,branch,current_year,graduating_year,linkedin_url,github_url,portfolio_url,headline,bio,skills,interests,experience,ai_blueprint,ai_evaluated_at,completed").eq("id", u.user!.id).single();
      return data ? { ...data, email: u.user!.email ?? "" } : null;
    },
  });
  const [f, setF] = useState<Form | null>(null);
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    if (!p) return;
    setF({ persona: (p.persona ?? "student") as Form["persona"], full_name: p.full_name ?? "", gender: p.gender ?? "", avatar_url: p.avatar_url ?? "",
      university: p.university ?? "", roll_no: p.roll_no ?? "", branch: p.branch ?? "", current_year: p.current_year ?? "", graduating_year: p.graduating_year ?? "",
      linkedin_url: p.linkedin_url ?? "", github_url: p.github_url ?? "", portfolio_url: p.portfolio_url ?? "", headline: p.headline ?? "", bio: p.bio ?? "",
      experience: p.experience ?? "", skills: p.skills, interests: p.interests } as Form);
    setEditing(!p.completed);
  }, [p]);

  const evaluate = useMutation({
    mutationFn: () => evalFn() as Promise<Blueprint>,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["profile-me"] }); qc.invalidateQueries({ queryKey: ["my-blueprint"] }); toast.success("Blueprint updated"); },
    onError: (e) => toast.error((e as Error).message),
  });
  const save = useMutation({
    mutationFn: async () => {
      const parsed = schema.safeParse(f);
      if (!parsed.success) throw new Error((parsed.error.issues[0]?.path.join(".") ?? "") + ": " + (parsed.error.issues[0]?.message ?? ""));
      const { error } = await supabase.from("profiles").update({ ...parsed.data, portfolio_url: parsed.data.portfolio_url || null, completed: true, updated_at: new Date().toISOString() }).eq("id", p!.id);
      if (error) throw error;
    },
    onSuccess: () => { setEditing(false); qc.invalidateQueries({ queryKey: ["profile-me"] }); toast.success("Profile saved — evaluating with AI…"); evaluate.mutate(); },
    onError: (e) => toast.error((e as Error).message),
  });

  async function upload(file: File): Promise<void> {
    try {
      if (file.size > 3e6) { toast.error("Photo must be under 3 MB"); return; }
      toast.info("Validating and compressing photo…");
      const compressedBlob = await compressPhoto(file);
      const path = `${p!.id}/avatar-${Date.now()}.webp`;
      const { error } = await supabase.storage.from("avatars").upload(path, compressedBlob, { contentType: "image/webp", upsert: true });
      if (error) { toast.error(error.message); return; }
      const { data } = await supabase.storage.from("avatars").createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
      setF((x) => x && { ...x, avatar_url: data!.signedUrl });
      toast.success("Photo uploaded and optimized!");
    } catch (err) {
      toast.error((err as Error).message || "Failed to upload photo");
    }
  }

  if (isLoading || !f || !p) return <div className="glass mt-8 h-96 animate-pulse rounded-[2rem]" />;
  const bp = p.ai_blueprint as Blueprint | null;
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF({ ...f, [k]: v });

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_400px]">
      <section className="glass rounded-[2rem] p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-gold">{p.email}</p>
            <h1 className="text-4xl font-bold">{p.completed ? "Your profile" : "Complete your profile"}</h1>
          </div>
          {p.completed && !editing && <Button variant="glass" onClick={() => setEditing(true)}>Edit</Button>}
        </div>

        {!editing ? (
          <div className="mt-8 flex flex-col gap-6 md:flex-row">
            {f.avatar_url && <img src={f.avatar_url} alt="" className="clay h-32 w-32 rounded-[2rem] object-cover" />}
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold">{f.full_name}</h2>
              <p className="text-muted-foreground">{f.headline}</p>
              <p>{f.branch} · Year {String(f.current_year)} · Class of {String(f.graduating_year)}</p>
              <div className="flex flex-wrap gap-3 font-mono text-sm">
                <a className="text-gold hover:underline" href={f.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a>
                <a className="text-gold hover:underline" href={f.github_url} target="_blank" rel="noreferrer">GitHub</a>
                {f.portfolio_url && <a className="text-gold hover:underline" href={f.portfolio_url} target="_blank" rel="noreferrer">Portfolio</a>}
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">{f.skills.map((s) => <span key={s} className="neo-inset rounded-full px-3 py-1 text-sm">{s}</span>)}</div>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-8" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
            <div>
              <Label>What describes you best?</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {PERSONAS.map(([v, l]) => <Button type="button" key={v} variant={f.persona === v ? "gold" : "glass"} size="sm" onClick={() => set("persona", v)}>{l}</Button>)}
              </div>
            </div>
            <div className="flex items-center gap-5">
              <label className="clay relative grid h-28 w-28 cursor-pointer place-items-center overflow-hidden rounded-[2rem]">
                {f.avatar_url ? <img src={f.avatar_url} alt="" className="h-full w-full object-cover" /> : <Camera className="text-gold" />}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
              </label>
              <p className="text-sm text-muted-foreground">Profile photo (required). Tap to upload.</p>
            </div>
            <Grid>
              <Field label="Full name"><Input value={f.full_name} onChange={(e) => set("full_name", e.target.value)} /></Field>
              <Field label="Gender">
                <select value={f.gender} onChange={(e) => set("gender", e.target.value)} className="neo-inset h-10 w-full rounded-full border-0 px-4">
                  <option value="">Select</option>{["Female", "Male", "Non-binary", "Prefer not to say"].map((g) => <option key={g}>{g}</option>)}
                </select>
              </Field>
              <Field label="University"><Input value={f.university} onChange={(e) => set("university", e.target.value)} /></Field>
              <Field label="University roll no."><Input value={f.roll_no} onChange={(e) => set("roll_no", e.target.value)} /></Field>
              <Field label="University email"><Input value={p.email} disabled /></Field>
              <Field label="Branch / field of study"><Input value={f.branch} onChange={(e) => set("branch", e.target.value)} placeholder="Computer Engineering" /></Field>
              <Field label="Current year"><Input type="number" value={String(f.current_year)} onChange={(e) => set("current_year", e.target.value as unknown as number)} /></Field>
              <Field label="Graduating year"><Input type="number" value={String(f.graduating_year)} onChange={(e) => set("graduating_year", e.target.value as unknown as number)} /></Field>
              <Field label="LinkedIn link"><Input value={f.linkedin_url} onChange={(e) => set("linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/…" /></Field>
              <Field label="GitHub link"><Input value={f.github_url} onChange={(e) => set("github_url", e.target.value)} placeholder="https://github.com/…" /></Field>
              <Field label="Portfolio (optional)"><Input value={f.portfolio_url} onChange={(e) => set("portfolio_url", e.target.value)} /></Field>
              <Field label="Headline"><Input value={f.headline} onChange={(e) => set("headline", e.target.value)} placeholder="ML engineer who ships" /></Field>
            </Grid>
            <div className="clay space-y-6 rounded-[2rem] p-6">
              <h3 className="text-2xl font-semibold">Skills blueprint</h3>
              <Field label="Core skills (min 3)"><TagInput value={f.skills} onChange={(v) => set("skills", v)} suggestions={SKILL_SUGGESTIONS} placeholder="Type and press Enter" /></Field>
              <Field label="Interests / domains"><TagInput value={f.interests} onChange={(v) => set("interests", v)} suggestions={["AI/ML", "Web3", "FinTech", "HealthTech", "EdTech", "Climate", "Social Good", "Gaming", "Hardware"]} placeholder="e.g. FinTech" /></Field>
              <Field label="Projects, hackathons, internships"><Textarea rows={5} value={f.experience} onChange={(e) => set("experience", e.target.value)} placeholder="Won HackTU 2025 with an RAG-based legal assistant…" className="neo-inset rounded-3xl border-0" /></Field>
              <Field label="About you"><Textarea rows={3} value={f.bio} onChange={(e) => set("bio", e.target.value)} className="neo-inset rounded-3xl border-0" /></Field>
            </div>
            <Button type="submit" variant="gold" size="lg" disabled={save.isPending}>{save.isPending ? "Saving…" : "Save & evaluate with AI"}</Button>
          </form>
        )}
      </section>

      <aside className="glass h-fit rounded-[2rem] p-6 lg:sticky lg:top-24">
        <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gold"><Sparkles className="h-4 w-4" /> AI blueprint</p>
        {evaluate.isPending ? (
          <div className="mt-4 space-y-3"><div className="neo-inset h-32 animate-pulse rounded-3xl" /><p className="text-sm text-muted-foreground">Reading your GitHub and skills…</p></div>
        ) : bp ? (
          <div className="mt-4 space-y-5">
            <div className="flex items-end gap-3"><span className="font-display text-6xl font-bold text-gold-gradient">{bp.score}</span><span className="pb-2 font-mono text-xs text-muted-foreground">{bp.level}</span></div>
            <p className="text-lg font-semibold">{bp.headline}</p>
            <p className="text-muted-foreground">{bp.summary}</p>
            <div className="space-y-2">{bp.core_skills?.map((s) => (
              <div key={s.name}><div className="flex justify-between text-sm"><span>{s.name}</span><span className="font-mono text-muted-foreground">{s.level}/5</span></div>
              <div className="neo-inset h-1.5 overflow-hidden rounded-full"><div className="h-full bg-gold-gradient" style={{ width: `${s.level * 20}%` }} /></div></div>
            ))}</div>
            <List title="Strengths" items={bp.strengths} /><List title="Ideal team roles" items={bp.ideal_roles} /><List title="Grow next" items={bp.growth_areas} />
            <div className="flex gap-2"><Button variant="gold" size="sm" asChild><Link to="/">See picks for you</Link></Button>
            <Button variant="ghost" size="sm" onClick={() => evaluate.mutate()}>Re-evaluate</Button></div>
          </div>
        ) : (
          <p className="mt-4 text-muted-foreground">Save your profile and HackHub's AI will read your GitHub, skills and experience to build your blueprint and pick hackathons for you.</p>
        )}
      </aside>
    </div>
  );
}
const Grid = ({ children }: { children: React.ReactNode }) => <div className="grid gap-4 md:grid-cols-2">{children}</div>;
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5 [&_input]:neo-inset [&_input]:h-10 [&_input]:rounded-full [&_input]:border-0 [&_input]:px-4"><Label className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{label}</Label>{children}</div>;
}
function List({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return <div><p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{title}</p><ul className="mt-1 list-inside list-disc text-sm">{items.map((i) => <li key={i}>{i}</li>)}</ul></div>;
}
