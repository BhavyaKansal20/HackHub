import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type Blueprint = {
  headline: string;
  summary: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  score: number;
  strengths: string[];
  domains: string[];
  core_skills: { name: string; level: number }[];
  growth_areas: string[];
  ideal_roles: string[];
  recommended_hackathon_ids: string[];
};

export const evaluateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { askJson, githubSignal } = await import("./ai.server");
    const { data: p, error } = await supabase
      .from("profiles")
      .select(
        "id,persona,full_name,gender,avatar_url,university,roll_no,branch,current_year,graduating_year,linkedin_url,github_url,portfolio_url,headline,bio,skills,interests,experience,ai_blueprint,ai_evaluated_at,completed"
      )
      .eq("id", userId)
      .single();
    if (error || !p) throw new Error("Profile not found");
    const gh = await githubSignal(p.github_url).catch(() => null);
    const { data: hacks } = await supabase.from("hackathons").select("id,title,tags,mode,description").limit(60);
    const bp = await askJson<Blueprint>(
      `You are HackHub's talent evaluator for Thapar Institute students. Evaluate honestly from the evidence. Output JSON with keys:
headline (<=12 words), summary (2-3 sentences, second person), level (Beginner|Intermediate|Advanced|Expert), score (0-100),
strengths (3-5), domains (2-5 e.g. "AI/ML","Web3"), core_skills (array of {name, level 1-5}, up to 10), growth_areas (2-4),
ideal_roles (2-4 hackathon team roles), recommended_hackathon_ids (up to 5 ids from the provided list, best fit first).`,
      JSON.stringify({
        profile: {
          persona: p.persona,
          branch: p.branch,
          year: p.current_year,
          headline: p.headline,
          bio: p.bio,
          skills: p.skills,
          interests: p.interests,
          experience: p.experience,
          portfolio: p.portfolio_url,
          linkedin: p.linkedin_url,
        },
        github: gh,
        hackathons: hacks,
      })
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
      const { data: cached } = await supabase
        .from("hackathon_fits")
        .select("*")
        .eq("user_id", userId)
        .eq("hackathon_id", data.hackathonId)
        .maybeSingle();
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
      JSON.stringify({ student: p, hackathon: h })
    );
    const row = {
      user_id: userId,
      hackathon_id: data.hackathonId,
      score: Math.round(fit.score),
      verdict: fit.verdict,
      summary: fit.summary,
      matched_skills: fit.matched_skills ?? [],
      gaps: fit.gaps ?? [],
    };
    await supabase.from("hackathon_fits").upsert(row);
    return row as Fit;
  });

/* =========================================================================
   HACKBOT ENGINE SERVER FUNCTIONS
   ========================================================================= */

export type HackBotStatus = {
  online: boolean;
  model: string;
  provider: string;
};

/**
 * Check HACKBOT engine status (Local Ollama vs. Deterministic Core)
 */
export const getHackBotEngineStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { checkLocalAIHealth } = await import("./ai.server");
  return await checkLocalAIHealth();
});

export type HackathonIdeaItem = {
  title: string;
  track: string;
  usp: string;
  stack: string[];
  architecture: string;
};

export type HackathonIdeationResponse = {
  ideas: HackathonIdeaItem[];
};

/**
 * Brainstorm 3 winning system architectures for a given hackathon.
 */
export const generateHackathonIdeas = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ hackathonId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { getHackathon } = await import("./hackathons");
    const { askJson } = await import("./ai.server");
    const hack = await getHackathon(data.hackathonId);
    if (!hack) throw new Error("Hackathon not found");

    const systemPrompt = `You are HACKBOT's hackathon ideation engine. Brainstorm 3 distinct, competitive, and winning project architectures for this hackathon.
Output strictly JSON matching:
{
  "ideas": [
    {
      "title": "string",
      "track": "string",
      "usp": "string (unique selling proposition, max 160 chars)",
      "stack": ["string", "string", "string", "string"],
      "architecture": "string (1-2 sentences on system data flow)"
    }
  ]
}`;

    const userPrompt = JSON.stringify({
      hackathon: {
        title: hack.title,
        organizer: hack.organizer,
        tags: hack.tags,
        mode: hack.mode,
        description: hack.description,
        rules: hack.rules,
      },
    });

    const res = await askJson<HackathonIdeationResponse>(systemPrompt, userPrompt);
    return res.ideas || [];
  });

/**
 * Draft an official On-Duty (OD) Leave Application for Thapar DoSA / HOD.
 */
export const draftODSlip = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      hackathonId: z.string().uuid().optional(),
      hackathonTitle: z.string().optional(),
      studentName: z.string().optional(),
      rollNo: z.string().optional(),
      branch: z.string().optional(),
      dates: z.string().optional(),
    })
  )
  .handler(async ({ data }) => {
    const { askText } = await import("./ai.server");
    const systemPrompt = "Draft an official, highly polite, formal On-Duty (OD) leave application for the Dean of Student Affairs (DoSA) and Head of Department at Thapar Institute of Engineering and Technology (TIET). Include student details, hackathon justification, dates, and assurance of academic catch-up.";
    const userPrompt = JSON.stringify({
      event: data.hackathonTitle || "National Technical Hackathon",
      studentName: data.studentName || "Student Developer",
      rollNo: data.rollNo || "102303XXX",
      branch: data.branch || "Computer Engineering",
      dates: data.dates || "Upcoming Hackathon Round",
    });

    return await askText(systemPrompt, userPrompt);
  });

/**
 * Chat interactively with HACKBOT copilot.
 */
export const chatWithHackBot = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      message: z.string().min(1).max(2000),
      history: z
        .array(
          z.object({
            role: z.enum(["system", "user", "assistant"]),
            content: z.string(),
          })
        )
        .optional(),
      hackathonContext: z
        .object({
          id: z.string().optional(),
          title: z.string().optional(),
          tags: z.array(z.string()).optional(),
        })
        .optional(),
      userContext: z
        .object({
          skills: z.array(z.string()).optional(),
          branch: z.string().optional(),
          year: z.number().optional(),
        })
        .optional(),
    })
  )
  .handler(async ({ data }) => {
    const { askText } = await import("./ai.server");

    const systemPrompt = `You are HACKBOT, the official intelligent hackathon copilot for HackHub at Thapar Institute of Engineering and Technology (TIET).
You assist students with:
1. Matching their skills and branch to high-potential hackathons (from Devfolio, Unstop, Devpost, MLH, HackerEarth, etc.).
2. Brainstorming novel project ideas, system architectures, and judging pitch angles.
3. Drafting compliant On-Duty (OD) leave applications for DoSA and departmental HODs.
4. Crafting team recruitment pitches and solving hackathon strategy questions.

Be concise, structured, supportive, and builder-focused. Use clean markdown (bullet points, bold highlights).
Context available:
- Current Hackathon: ${data.hackathonContext?.title ? JSON.stringify(data.hackathonContext) : "None specified"}
- Student Context: ${data.userContext?.skills ? JSON.stringify(data.userContext) : "Anonymous student"}`;

    return await askText(systemPrompt, data.message);
  });
