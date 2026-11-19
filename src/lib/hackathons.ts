import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { VERIFIED_HACKATHONS } from "./hackathons-catalog";

export type Hackathon = Tables<"hackathons">;

const SYNC_INTERVAL_MS = 15 * 60 * 1000;

export const hackathonsQuery = () =>
  queryOptions({
    queryKey: ["hackathons"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("hackathons")
          .select("*")
          .order("participants", { ascending: false, nullsFirst: false })
          .limit(500);

        if (!error && data && data.length > 0) {
          const existingIds = new Set(data.map((h) => h.id || h.external_id));
          const missing = VERIFIED_HACKATHONS.filter((v) => !existingIds.has(v.id) && !existingIds.has(v.external_id));
          return [...data, ...missing];
        }
      } catch (err) {
        console.warn("Falling back to verified catalog:", err);
      }
      return VERIFIED_HACKATHONS;
    },
    staleTime: SYNC_INTERVAL_MS,
    refetchInterval: SYNC_INTERVAL_MS,
  });

export const hackathonQuery = (id: string) =>
  queryOptions({
    queryKey: ["hackathon", id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("hackathons").select("*").eq("id", id).maybeSingle();
        if (!error && data) return data;
      } catch (err) {
        console.warn("Error fetching hackathon by id, checking catalog:", err);
      }
      const fallback = VERIFIED_HACKATHONS.find((h) => h.id === id || h.external_id === id);
      if (fallback) return fallback;
      return null;
    },
    staleTime: SYNC_INTERVAL_MS,
    refetchInterval: SYNC_INTERVAL_MS,
  });

export function deadlineLabel(h: Hackathon) {
  if (h.reg_ends_at) {
    const d = new Date(h.reg_ends_at);
    const days = Math.ceil((d.getTime() - Date.now()) / 864e5);
    if (days < 0) return "Registration closed";
    return days === 0 ? "Closes today" : `Closes in ${days} day${days > 1 ? "s" : ""}`;
  }
  return h.description && h.source === "Devpost" ? h.description : null;
}
export function datesLabel(h: Hackathon) {
  if (h.dates_label) return h.dates_label;
  if (!h.starts_at) return null;
  const f = (s: string) => new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return h.ends_at ? `${f(h.starts_at)} – ${f(h.ends_at)}` : f(h.starts_at);
}
