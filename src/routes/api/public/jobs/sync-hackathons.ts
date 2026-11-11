import { createFileRoute } from "@tanstack/react-router";
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";
import { fetchAll } from "@/lib/ingest";

export const Route = createFileRoute("/api/public/jobs/sync-hackathons")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authFailure = await authenticateCronRequest(request);
        if (authFailure) return authFailure;
        const rows = (await fetchAll()).slice(0, 300);
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin
          .from("hackathons")
          .upsert(rows.map((r) => ({ ...r, updated_at: new Date().toISOString() })), { onConflict: "source,external_id" });
        if (error) return Response.json({ success: false, error: error.message }, { status: 500 });
        return Response.json({ success: true, count: rows.length });
      },
    },
  },
});
