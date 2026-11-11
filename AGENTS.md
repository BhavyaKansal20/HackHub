<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## HackHub architecture
- Access is Thapar-only: a BEFORE INSERT trigger on auth.users rejects non-@thapar.edu emails and creates the profile row — keep domain enforcement in the database, not just the UI.
- Hackathon listings come only from publishers with open feeds (src/lib/ingest.ts), upserted by the cron route /api/public/jobs/sync-hackathons — never scrape sites that forbid it.
- Team-match and interest notifications are created by SECURITY DEFINER triggers on team_posts/team_interests, so clients never insert notifications for other users.
- AI calls (profile blueprint, hackathon fit) live in src/lib/hub.functions.ts behind requireSupabaseAuth; fits are cached in hackathon_fits.
