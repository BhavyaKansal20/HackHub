import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Trophy, Calendar, MapPin, ArrowRight, X, Flame } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function FlagshipEventModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Show flagship modal once per session
    const seen = sessionStorage.getItem("hackhub_flagship_seen");
    if (!seen) {
      const timer = setTimeout(() => {
        setOpen(true);
        sessionStorage.setItem("hackhub_flagship_seen", "true");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="glass max-w-lg rounded-[2.5rem] border-gold/40 p-6 sm:p-8 text-foreground shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 rounded-full bg-gold-gradient px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-md">
              <Flame className="h-3 w-3" /> Flagship Spotlight
            </span>
          </div>
          <DialogTitle className="mt-3 font-display text-3xl font-bold leading-tight">
            HackTU 6.0: The Annual North India Hackathon
          </DialogTitle>
          <p className="text-sm text-gold-soft font-mono">By Thapar Institute of Engineering & Technology, Patiala</p>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <div className="clay overflow-hidden rounded-2xl border border-glass-border">
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80"
              alt="HackTU"
              className="h-40 w-full object-cover"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="clay rounded-2xl p-3 space-y-1">
              <span className="flex items-center gap-1 text-muted-foreground font-mono uppercase text-[10px]">
                <Trophy className="h-3 w-3 text-gold" /> Cash Prizes
              </span>
              <p className="font-bold text-sm text-foreground">₹ 5,00,000 +</p>
            </div>
            <div className="clay rounded-2xl p-3 space-y-1">
              <span className="flex items-center gap-1 text-muted-foreground font-mono uppercase text-[10px]">
                <MapPin className="h-3 w-3 text-gold" /> Venue
              </span>
              <p className="font-bold text-sm text-foreground">TIET Campus, Patiala</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            36-hour continuous build sprint. Mentorship by top tech leaders, VC demo day, and on-duty (OD) leave for participating Thapar students.
          </p>
        </div>

        <DialogFooter className="flex flex-row justify-between gap-2 sm:justify-between pt-2">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Later
          </Button>
          <Button variant="gold" size="sm" asChild onClick={() => setOpen(false)} className="gap-1.5">
            <Link to="/team-builder" search={{ post: undefined }}>
              Form a Team <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
