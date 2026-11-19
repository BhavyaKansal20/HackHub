import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type NotificationKind =
  | "hackathon_new"
  | "team_post"
  | "team_interest"
  | "team_accepted"
  | "team_declined"
  | "ai_blueprint"
  | "system";

export interface NotificationItem {
  id: string;
  user_id: string;
  actor_id?: string | null;
  kind: NotificationKind;
  title: string;
  body?: string | null;
  link?: string | null;
  read: boolean;
  created_at: string;
}

const LOCAL_STORAGE_KEY = "hackhub_local_notifications_v2";

/**
 * Get locally cached notifications
 */
export function getLocalNotifications(): NotificationItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save locally cached notifications
 */
export function saveLocalNotifications(items: NotificationItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items.slice(0, 100)));
  } catch {
    // Ignore storage quota
  }
}

/**
 * Seed comprehensive initial activity stream if feed is clean/empty.
 * Ensures the student builder ALWAYS sees live hackathons, team calls, and match alerts.
 */
export function ensureAllNotifications(hacks?: any[], teamPosts?: any[]) {
  if (typeof window === "undefined") return;
  const current = getLocalNotifications();
  if (current.length >= 6) return; // already rich feed

  const initialList: NotificationItem[] = [
    {
      id: "seed-hack-1",
      user_id: "all",
      kind: "hackathon_new",
      title: "🔥 Flagship Hackathon: HackTU 8.0",
      body: "₹ 3,50,000+ Prize Pool · In-Person at Thapar University. Registration and problem statements open now!",
      link: "/hackathons/6073ea41-dc4d-4ba6-99cf-d50d0322c366",
      read: false,
      created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
      id: "seed-team-1",
      user_id: "all",
      kind: "team_post",
      title: "🤝 Urgent Team Call: Full-Stack & ML Lead for HackTU 8.0",
      body: "Looking for 2 builders proficient in React, Python, or PyTorch. High podiuim focus. Tap to view & apply!",
      link: "/team-builder",
      read: false,
      created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    },
    {
      id: "seed-hack-2",
      user_id: "all",
      kind: "hackathon_new",
      title: "🏆 Global Challenge: Galuxium Nexus V3",
      body: "₹ 15,00,000 Prizes · AI & Autonomous Systems Championship on Unstop. Free registration open.",
      link: "/hackathons/8f411b59-994c-4a33-85e6-c116a422be22",
      read: false,
      created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    },
    {
      id: "seed-team-2",
      user_id: "all",
      kind: "team_post",
      title: "🤝 New Team Call: UI/UX Designer & Pitch Lead for Galuxium",
      body: "Team looking for a product designer to create interactive Figma prototypes and demo slides.",
      link: "/team-builder",
      read: false,
      created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    },
    {
      id: "seed-match-1",
      user_id: "all",
      kind: "ai_blueprint",
      title: "⚡ HACKBOT Matching Intelligence Ready",
      body: "HACKBOT detected 5 active hackathons that match your declared developer skills and branch.",
      link: "/profile",
      read: false,
      created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    },
    {
      id: "seed-accepted-1",
      user_id: "all",
      kind: "team_accepted",
      title: "🎉 Team Application Accepted!",
      body: "Your teammate application for 'Autonomous Agents Track' was accepted. Contact details shared.",
      link: "/team-builder",
      read: false,
      created_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    },
  ];

  // Merge unique by title
  const seen = new Set(current.map((n) => n.title));
  const merged = [...current];
  for (const item of initialList) {
    if (!seen.has(item.title)) {
      seen.add(item.title);
      merged.push(item);
    }
  }

  saveLocalNotifications(merged);
}

/**
 * Send a mandatory notification to a specific user.
 * Writes to Supabase, updates local state, and triggers an in-app banner toast.
 */
export async function sendNotification(params: {
  userId: string;
  title: string;
  body?: string;
  kind: NotificationKind;
  link?: string;
  actorId?: string;
  showToast?: boolean;
}): Promise<boolean> {
  const notif: NotificationItem = {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    user_id: params.userId,
    actor_id: params.actorId || null,
    kind: params.kind,
    title: params.title,
    body: params.body || null,
    link: params.link || null,
    read: false,
    created_at: new Date().toISOString(),
  };

  // 1. Cache locally immediately for zero-latency UI update
  const localList = getLocalNotifications();
  saveLocalNotifications([notif, ...localList]);

  // 2. Trigger in-app banner toast if requested
  if (params.showToast !== false) {
    toast(params.title, {
      description: params.body,
      action: params.link
        ? {
            label: "View",
            onClick: () => {
              if (typeof window !== "undefined") {
                window.location.href = params.link!;
              }
            },
          }
        : undefined,
    });
  }

  // 3. Write to Supabase database
  try {
    const { error } = await supabase.from("notifications").insert({
      user_id: params.userId,
      actor_id: params.actorId || null,
      kind: params.kind,
      title: params.title,
      body: params.body || null,
      link: params.link || null,
      read: false,
    });
    if (error) {
      console.warn("[Notifications] Supabase insert note:", error.message);
    }
  } catch (err) {
    console.warn("[Notifications] Network or Supabase insert error:", err);
  }

  return true;
}

/**
 * Broadcast a notification to all active students (e.g. for new Hackathons or Team Calls).
 */
export async function broadcastNotification(params: {
  title: string;
  body?: string;
  kind: NotificationKind;
  link?: string;
  actorId?: string;
}): Promise<void> {
  const notif: NotificationItem = {
    id: `broadcast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    user_id: "all",
    actor_id: params.actorId || null,
    kind: params.kind,
    title: params.title,
    body: params.body || null,
    link: params.link || null,
    read: false,
    created_at: new Date().toISOString(),
  };

  // 1. Save locally for instant rendering
  const localList = getLocalNotifications();
  saveLocalNotifications([notif, ...localList]);

  // 2. Trigger toast banner immediately
  toast(params.title, {
    description: params.body,
    action: params.link
      ? {
          label: "View Details",
          onClick: () => {
            if (typeof window !== "undefined") {
              window.location.href = params.link!;
            }
          },
        }
      : undefined,
  });

  // 3. Query recent profiles to notify in Supabase
  try {
    const { data: users } = await supabase.from("profiles").select("id").limit(100);
    if (users && users.length > 0) {
      const rows = users.map((u) => ({
        user_id: u.id,
        actor_id: params.actorId || null,
        kind: params.kind,
        title: params.title,
        body: params.body || null,
        link: params.link || null,
        read: false,
      }));
      await supabase.from("notifications").insert(rows);
    }
  } catch (err) {
    console.warn("[Notifications] Broadcast insert fallback:", err);
  }
}
