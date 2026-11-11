import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Hackathon = Tables<"hackathons">;

export const hackathonsQuery = () =>
  queryOptions({
    queryKey: ["hackathons"],
    queryFn: async () => {
      const { data, error } = await supabase.from("hackathons").select("*").order("participants", { ascending: false, nullsFirst: false }).limit(500);
      if (error) throw error;
      return data;
    },
  });

export const hackathonQuery = (id: string) =>
  queryOptions({
    queryKey: ["hackathon", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("hackathons").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
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
