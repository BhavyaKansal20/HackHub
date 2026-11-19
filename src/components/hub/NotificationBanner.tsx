import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, Bell, ArrowRight, X } from "lucide-react";
import { getLocalNotifications } from "@/lib/notifications";

export function NotificationBanner() {
  const [visible, setVisible] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unread = getLocalNotifications().filter((n) => !n.read).length;
    setUnreadCount(unread);
    const dismissed = sessionStorage.getItem("hackhub_alert_dismissed");
    if (dismissed) setVisible(false);
  }, []);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem("hackhub_alert_dismissed", "true");
  };

  return (
    <aside
      aria-label="Campus alert"
      className="relative z-30 border-b border-gold/30 bg-gradient-to-r from-amber-500/10 via-gold/15 to-amber-500/10 px-4 py-2 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
          </span>

          <span className="rounded-full bg-gold/20 px-2 py-0.5 font-mono text-[10px] font-bold text-gold border border-gold/30 shrink-0">
            LIVE ALERTS
          </span>

          <p className="truncate text-foreground font-medium">
            🔥 <strong>HackTU 8.0 & Galuxium Nexus Active:</strong> 10 verified hackathons & new team calls open for recruitment.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/notifications"
            className="flex items-center gap-1 font-semibold text-gold hover:underline"
          >
            <span>View All ({unreadCount})</span>
            <ArrowRight className="h-3 w-3" />
          </Link>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-gold/10 hover:text-foreground transition"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    </aside>
  );
}
