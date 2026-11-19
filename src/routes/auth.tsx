import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — HackHub" },
      { name: "description", content: "Sign in to HackHub with your @thapar.edu Google account." },
      { property: "og:title", content: "Sign in — HackHub" },
      { property: "og:description", content: "Thapar-only access to hackathons, AI fit scores and teams." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user, ready } = useSession();
  const navigate = useNavigate();
  const [err, setErr] = useState<string | null>(null);
  const [referredBy, setReferredBy] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Check URL parameters for any OAuth redirect errors from Supabase or referral code
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const errorDesc = params.get("error_description") || params.get("error");
    if (errorDesc) {
      const decoded = decodeURIComponent(errorDesc.replace(/\+/g, " "));
      setErr(
        /Database error/i.test(decoded)
          ? "Database error: Please run the fix SQL in Supabase SQL editor to link the user profile trigger."
          : decoded,
      );
    }

    const ref = params.get("ref");
    if (ref) {
      setReferredBy(ref);
      try {
        localStorage.setItem("hackhub_referred_by", ref);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (ready && user) navigate({ to: "/profile" });
  }, [ready, user, navigate]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session?.user) {
        navigate({ to: "/profile" });
      }
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function google() {
    setErr(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth`,
          queryParams: { hd: "thapar.edu", prompt: "select_account" },
        },
      });
      if (error) {
        const r = await lovable.auth.signInWithOAuth("google", {
          redirect_uri: window.location.origin + "/auth",
          extraParams: { hd: "thapar.edu", prompt: "select_account" },
        });
        if (r?.error) throw r.error;
      }
    } catch (e: any) {
      setBusy(false);
      setErr(
        /thapar|Database error/i.test(String(e.message ?? e))
          ? "Only @thapar.edu accounts can join HackHub. Please pick your university account."
          : String(e.message ?? e),
      );
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-md">
      <div className="glass rounded-[2rem] p-10 text-center">
        <img
          src="/HackHubLogo.png"
          alt="HackHub"
          className="mx-auto mb-6 h-24 sm:h-28 w-auto object-contain drop-shadow-2xl"
        />
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">Thapar Institute · Patiala</p>
        <h1 className="mt-2 text-5xl font-bold">Enter the <span className="text-gold-gradient">Hub</span></h1>
        <p className="mt-3 text-muted-foreground">Restricted to verified <span className="font-mono text-foreground">@thapar.edu</span> accounts.</p>
        {referredBy && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-mono text-gold">
            🎁 Referred by friend: <span className="font-bold underline">{referredBy}</span>
          </div>
        )}
        <button
          type="button" onClick={google} disabled={busy}
          className="mx-auto mt-8 flex w-full items-center justify-center gap-[10px] rounded-full border border-[#747775] bg-[#FFFFFF] px-3 py-3 text-[14px] font-medium leading-5 text-[#1F1F1F] disabled:opacity-60"
        >
          <svg aria-hidden="true" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
          {busy ? "Opening Google…" : "Continue with Google"}
        </button>
        {err && <p className="mt-4 rounded-2xl bg-destructive/15 p-3 text-sm text-destructive">{err}</p>}
      </div>
    </div>
  );
}
