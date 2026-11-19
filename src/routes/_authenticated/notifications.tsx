import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  Trophy,
  Users,
  Mail,
  Sparkles,
  ExternalLink,
  CheckCheck,
  Trash2,
  Filter,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getLocalNotifications, saveLocalNotifications, type NotificationItem } from "@/lib/notifications";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — HackHub" },
      { name: "description", content: "Mandatory notifications for all hackathons, team calls, and match acceptances." },
      { property: "og:title", content: "Notifications — HackHub" },
      { property: "og:description", content: "Real-time updates on competitions and team activities." },
    ],
  }),
  component: Notifications,
});

type FilterType = "all" | "hackathons" | "teams" | "matches";

function Notifications() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<FilterType>("all");

  const { data = [], isLoading } = useQuery<NotificationItem[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      let dbItems: NotificationItem[] = [];
      try {
        const res = await supabase
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);
        dbItems = (res.data as NotificationItem[]) ?? [];
      } catch {
        // Fallback
      }

      const localItems = getLocalNotifications();
      // Merge unique by title & created_at or id
      const seen = new Set<string>();
      const merged: NotificationItem[] = [];

      for (const item of [...dbItems, ...localItems]) {
        const key = `${item.title}-${item.created_at?.slice(0, 16)}`;
        if (!seen.has(key)) {
          seen.add(key);
          merged.push(item);
        }
      }

      // Sort newest first
      return merged.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["notifications"] });
    qc.invalidateQueries({ queryKey: ["unread"] });
  };

  const markAll = async () => {
    try {
      await supabase.from("notifications").update({ read: true }).eq("read", false);
    } catch {
      // Ignore
    }
    const local = getLocalNotifications().map((n) => ({ ...n, read: true }));
    saveLocalNotifications(local);
    toast.success("All notifications marked as read");
    refresh();
  };

  const openItem = async (n: NotificationItem) => {
    try {
      if (!n.id.startsWith("local-")) {
        await supabase.from("notifications").update({ read: true }).eq("id", n.id);
      }
    } catch {
      // Ignore
    }
    const local = getLocalNotifications().map((item) =>
      item.id === n.id ? { ...item, read: true } : item
    );
    saveLocalNotifications(local);
    refresh();
  };

  const clearAll = () => {
    saveLocalNotifications([]);
    toast.info("Cleared local notification history");
    refresh();
  };

  const filteredData = data.filter((n) => {
    if (filter === "all") return true;
    if (filter === "hackathons") return n.kind === "hackathon_new";
    if (filter === "teams") return n.kind === "team_post" || n.kind === "team_interest";
    if (filter === "matches") return n.kind === "team_accepted" || n.kind === "ai_blueprint";
    return true;
  });

  const unreadCount = data.filter((n) => !n.read).length;

  return (
    <div className="mx-auto mt-6 max-w-3xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground">Notifications</h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-gold/15 px-2.5 py-0.5 font-mono text-xs font-bold text-gold border border-gold/30">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time mandatory alerts for hackathons, team calls, and match acceptances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="gold" size="sm" onClick={markAll} className="gap-1.5 text-xs">
              <CheckCheck className="h-4 w-4" /> Mark all read
            </Button>
          )}
          <Button variant="glass" size="sm" onClick={clearAll} className="text-xs text-muted-foreground hover:text-destructive">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "all", label: "All Updates" },
          { id: "hackathons", label: "Hackathons" },
          { id: "teams", label: "Team Calls" },
          { id: "matches", label: "Matches & Acceptances" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id as FilterType)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
              filter === t.id
                ? "bg-gold text-background font-semibold shadow-sm"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {isLoading && (
          <div className="space-y-3">
            <div className="clay h-20 animate-pulse rounded-[1.75rem]" />
            <div className="clay h-20 animate-pulse rounded-[1.75rem]" />
          </div>
        )}

        {!isLoading && !filteredData.length && (
          <div className="clay rounded-[2rem] p-12 text-center space-y-3 border border-glass-border">
            <Bell className="h-8 w-8 text-gold mx-auto opacity-70" />
            <h3 className="font-semibold text-base text-foreground">You're all caught up!</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Any new hackathons, incoming team applications, or builder match acceptances will automatically appear here and ring your notifications.
            </p>
          </div>
        )}

        {filteredData.map((n) => {
          const isUnread = !n.read;
          const targetUrl = n.link || "/";

          // Select icon based on kind
          let Icon = Bell;
          let iconColor = "text-gold bg-gold/15 border-gold/30";

          if (n.kind === "hackathon_new") {
            Icon = Trophy;
            iconColor = "text-amber-400 bg-amber-400/15 border-amber-400/30";
          } else if (n.kind === "team_post") {
            Icon = Users;
            iconColor = "text-blue-400 bg-blue-400/15 border-blue-400/30";
          } else if (n.kind === "team_interest") {
            Icon = Mail;
            iconColor = "text-purple-400 bg-purple-400/15 border-purple-400/30";
          } else if (n.kind === "team_accepted") {
            Icon = CheckCircle2;
            iconColor = "text-emerald-400 bg-emerald-400/15 border-emerald-400/30";
          } else if (n.kind === "ai_blueprint") {
            Icon = Sparkles;
            iconColor = "text-gold bg-gold/20 border-gold/40";
          }

          return (
            <a
              key={n.id}
              href={targetUrl}
              onClick={() => openItem(n)}
              className={`clay group relative flex items-start gap-4 rounded-[1.75rem] p-5 transition duration-200 hover:border-gold/50 ${
                isUnread ? "border-gold/40 bg-accent/20" : "opacity-75"
              }`}
            >
              {/* Unread indicator dot */}
              {isUnread && (
                <span className="absolute -left-1.5 top-6 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-gold" />
                </span>
              )}

              {/* Kind Icon */}
              <div
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl border ${iconColor} shadow-sm`}
              >
                <Icon className="h-5 w-5" />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm sm:text-base text-foreground group-hover:text-gold transition">
                    {n.title}
                  </p>
                  <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                    {new Date(n.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {n.body && (
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {n.body}
                  </p>
                )}
              </div>

              {/* External action indicator */}
              <div className="shrink-0 self-center text-muted-foreground group-hover:text-gold group-hover:translate-x-0.5 transition">
                <ExternalLink className="h-4 w-4" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
