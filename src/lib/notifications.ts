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

const LOCAL_STORAGE_KEY = "hackhub_local_notifications_v1";

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
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
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
 * Ensure initial featured hackathon alerts exist in the notification feed
 */
export function ensureHackathonNotifications(hacks: any[]) {
  if (typeof window === "undefined" || !hacks || !hacks.length) return;
  const local = getLocalNotifications();
  if (local.some((n) => n.kind === "hackathon_new")) return;

  const topHacks = hacks.slice(0, 3);
  const newNotifs: NotificationItem[] = topHacks.map((h, i) => ({
    id: `hack-alert-${h.id || i}`,
    user_id: "all",
    kind: "hackathon_new",
    title: `🔥 Verified Hackathon: ${h.title}`,
    body: `${h.prize && h.prize !== "$0" ? `${h.prize} Prizes · ` : ""}${h.mode} on ${h.source || "Devfolio"}. Click to view details and AI match score.`,
    link: `/hackathons/${h.id}`,
    read: false,
    created_at: new Date(Date.now() - i * 1800000).toISOString(),
  }));

  saveLocalNotifications([...newNotifs, ...local]);
}
export async function broadcastNotification(params: {
  title: string;
  body?: string;
  kind: NotificationKind;
  link?: string;
  actorId?: string;
}): Promise<void> {
  // Always trigger local toast on current screen
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

  // Query recent profiles to notify
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
