import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  return { session, user: session?.user ?? null, ready };
}

export const SKILL_SUGGESTIONS = ["Python","JavaScript","TypeScript","React","Next.js","Node.js","Flutter","Kotlin","Swift","Java","C++","Go","Rust","Solidity","Machine Learning","Deep Learning","LLMs","Computer Vision","NLP","Data Science","SQL","MongoDB","Firebase","AWS","Docker","Kubernetes","DevOps","UI/UX","Figma","Product Management","Pitching","Blockchain","Cybersecurity","IoT","Embedded","Robotics","AR/VR","Game Dev","Unity"];
