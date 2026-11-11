// Pure fetch-based normalizers for publishers with open listing feeds.
export type HackathonRow = {
  source: string; external_id: string; title: string; organizer: string | null; url: string;
  image_url: string | null; mode: string | null; location: string | null; starts_at: string | null;
  ends_at: string | null; reg_ends_at: string | null; dates_label: string | null; prize: string | null;
  participants: number | null; tags: string[]; description: string | null;
};
const strip = (s: string | null | undefined) => (s ? s.replace(/<[^>]*>/g, "").trim() : null);

export async function fetchDevpost(pages = 3): Promise<HackathonRow[]> {
  const out: HackathonRow[] = [];
  for (let p = 1; p <= pages; p++) {
    const r = await fetch(`https://devpost.com/api/hackathons?status[]=upcoming&status[]=open&page=${p}`, { headers: { accept: "application/json" } });
    if (!r.ok) break;
    const j = (await r.json()) as { hackathons: any[] };
    for (const h of j.hackathons ?? []) {
      const online = h.displayed_location?.location === "Online";
      out.push({
        source: "Devpost", external_id: String(h.id), title: h.title, organizer: h.organization_name ?? null,
        url: h.url, image_url: h.thumbnail_url ? (h.thumbnail_url.startsWith("//") ? "https:" + h.thumbnail_url : h.thumbnail_url) : null,
        mode: online ? "Online" : "In-person", location: h.displayed_location?.location ?? null,
        starts_at: null, ends_at: null, reg_ends_at: null, dates_label: h.submission_period_dates ?? null,
        prize: strip(h.prize_amount), participants: h.registrations_count ?? null,
        tags: (h.themes ?? []).map((t: any) => t.name), description: h.time_left_to_submission ?? null,
      });
    }
    if (!j.hackathons?.length) break;
  }
  return out;
}

export async function fetchDevfolio(): Promise<HackathonRow[]> {
  const out: HackathonRow[] = [];
  for (const type of ["application_open", "upcoming"]) {
    const r = await fetch("https://api.devfolio.co/api/search/hackathons", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ type, from: 0, size: 60 }),
    });
    if (!r.ok) continue;
    const j = (await r.json()) as any;
    for (const hit of j?.hits?.hits ?? []) {
      const h = hit._source; const s = h.hackathon_setting ?? {};
      out.push({
        source: "Devfolio", external_id: h.uuid, title: h.name, organizer: h.hosted_by?.name ?? null,
        url: `https://${h.slug}.devfolio.co/`, image_url: s.logo ?? h.cover_img ?? null,
        mode: h.is_online ? "Online" : "In-person",
        location: h.is_online ? "Online" : [h.city, h.state, h.country].filter(Boolean).join(", ") || null,
        starts_at: h.starts_at ?? null, ends_at: h.ends_at ?? null, reg_ends_at: s.reg_ends_at ?? null,
        dates_label: null, prize: null, participants: h.participants_count ?? null,
        tags: (h.themes ?? []).map((t: any) => t?.theme?.name ?? t?.name).filter(Boolean),
        description: strip(h.tagline ?? h.desc)?.slice(0, 1200) ?? null,
      });
    }
  }
  const seen = new Set<string>();
  return out.filter((h) => (seen.has(h.external_id) ? false : (seen.add(h.external_id), true)));
}

export async function fetchAll() {
  const [a, b] = await Promise.allSettled([fetchDevpost(), fetchDevfolio()]);
  return [...(a.status === "fulfilled" ? a.value : []), ...(b.status === "fulfilled" ? b.value : [])];
}
