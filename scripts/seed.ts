import { fetchAll } from "../src/lib/ingest";
import { createClient } from "@supabase/supabase-js";

async function main() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    console.error("❌ Missing SUPABASE_URL or API key in .env or environment variables.");
    process.exit(1);
  }

  console.log(`📡 Fetching live hackathons from Devpost and Devfolio...`);
  const rows = await fetchAll();
  console.log(`✅ Fetched ${rows.length} hackathons!`);

  console.log(`💾 Upserting to Supabase table 'hackathons' at ${url}...`);
  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from("hackathons")
    .upsert(rows.map((r) => ({ ...r, updated_at: new Date().toISOString() })), { onConflict: "source,external_id" })
    .select("id");

  if (error) {
    console.error("❌ Upsert failed:", error.message);
    if (error.message.includes("violates row-level security") || error.message.includes("new row violates")) {
      console.log("\n💡 Tip: Provide SUPABASE_SERVICE_ROLE_KEY in .env to bypass RLS for seeding, or ensure the RLS audit policies are applied in Supabase.");
    }
    process.exit(1);
  }

  console.log(`🎉 Successfully synced ${data?.length || rows.length} hackathons into your database!`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
