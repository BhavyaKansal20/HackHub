import { createFileRoute } from "@tanstack/react-router";
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";
import { addSecurityHeaders, rateLimit } from "@/lib/security";
import { fetchAll } from "@/lib/ingest";

export const Route = createFileRoute("/api/public/jobs/sync-hackathons")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Rate limit: 5 calls per minute even for authenticated cron
        const rl = rateLimit(request, "sync-hackathons", 5, 60);
        if (rl) return rl;

        const authFailure = await authenticateCronRequest(request);
        if (authFailure) return authFailure;

        try {
          const rows = (await fetchAll()).slice(0, 300);
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { error } = await supabaseAdmin
            .from("hackathons")
            .upsert(rows.map((r) => ({ ...r, updated_at: new Date().toISOString() })), { onConflict: "source,external_id" });
          if (error) {
            const res = Response.json({ success: false, error: error.message }, { status: 500 });
            return addSecurityHeaders(res);
          }
          const res = Response.json({ success: true, count: rows.length });
          return addSecurityHeaders(res);
        } catch (err) {
          const res = Response.json({ success: false, error: "Internal server error" }, { status: 500 });
          return addSecurityHeaders(res);
        }
      },
    },
  },
});
