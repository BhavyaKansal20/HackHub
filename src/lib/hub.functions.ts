import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type Blueprint = {
  headline: string; summary: string; level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  score: number; strengths: string[]; domains: string[]; core_skills: { name: string; level: number }[];
  growth_areas: string[]; ideal_roles: string[];
  recommended_hackathon_ids: string[];
};

export const evaluateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { askJson, githubSignal } = await import("./ai.server");
    const { data: p, error } = await supabase.from("profiles").select("id,persona,full_name,gender,avatar_url,university,roll_no,branch,current_year,graduating_year,linkedin_url,github_url,portfolio_url,headline,bio,skills,interests,experience,ai_blueprint,ai_evaluated_at,completed").eq("id", userId).single();
    if (error || !p) throw new Error("Profile not found");
    const gh = await githubSignal(p.github_url).catch(() => null);
    const { data: hacks } = await supabase.from("hackathons").select("id,title,tags,mode,description").limit(60);
    const bp = await askJson<Blueprint>(
      `You are HackHub's talent evaluator for Thapar Institute students. Evaluate honestly from the evidence. Output JSON with keys:
headline (<=12 words), summary (2-3 sentences, second person), level (Beginner|Intermediate|Advanced|Expert), score (0-100),
strengths (3-5), domains (2-5 e.g. "AI/ML","Web3"), core_skills (array of {name, level 1-5}, up to 10), growth_areas (2-4),
ideal_roles (2-4 hackathon team roles), recommended_hackathon_ids (up to 5 ids from the provided list, best fit first).`,
      JSON.stringify({ profile: { persona: p.persona, branch: p.branch, year: p.current_year, headline: p.headline, bio: p.bio,
        skills: p.skills, interests: p.interests, experience: p.experience, portfolio: p.portfolio_url, linkedin: p.linkedin_url },
        github: gh, hackathons: hacks }),
    );
    await supabase.from("profiles").update({ ai_blueprint: bp as any, ai_evaluated_at: new Date().toISOString() }).eq("id", userId);
    return bp;
  });

export type Fit = { score: number; verdict: string; summary: string; matched_skills: string[]; gaps: string[] };

export const getHackathonFit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ hackathonId: z.string().uuid(), refresh: z.boolean().optional() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    if (!data.refresh) {
      const { data: cached } = await supabase.from("hackathon_fits").select("*").eq("user_id", userId).eq("hackathon_id", data.hackathonId).maybeSingle();
      if (cached) return cached as unknown as Fit;
    }
    const [{ data: p }, { data: h }] = await Promise.all([
      supabase.from("profiles").select("skills,interests,experience,branch,current_year,ai_blueprint,headline").eq("id", userId).single(),
      supabase.from("hackathons").select("title,organizer,tags,mode,location,description,prize").eq("id", data.hackathonId).single(),
    ]);
    if (!p || !h) throw new Error("Missing profile or hackathon");
    const { askJson } = await import("./ai.server");
    const fit = await askJson<Fit>(
      `You compare a student's profile against a hackathon, like LinkedIn's job match. Output JSON: score (0-100), verdict (short punchy line like "Strong fit — you should participate"), summary (2-3 sentences, second person, concrete), matched_skills (skills of theirs that fit), gaps (skills/roles to recruit or learn).`,
      JSON.stringify({ student: p, hackathon: h }),
    );
    const row = { user_id: userId, hackathon_id: data.hackathonId, score: Math.round(fit.score), verdict: fit.verdict, summary: fit.summary,
      matched_skills: fit.matched_skills ?? [], gaps: fit.gaps ?? [] };
    await supabase.from("hackathon_fits").upsert(row);
    return row as Fit;
  });
