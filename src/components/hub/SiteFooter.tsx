import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";

export function SiteFooter() {
  return <footer className="mt-auto border-t border-border px-4 py-8">
    <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-[minmax(0,1fr)_auto]">
      <div className="min-w-0">
        <Link to="/" className="inline-flex items-center gap-2.5 font-display text-3xl font-bold">
          <img src="/HackHubLogo.svg" alt="HackHub" className="h-8 w-8 rounded-lg object-contain shadow-sm" />
          <span>Hack<span className="text-gold">Hub</span></span>
        </Link>
        <p className="mt-2 text-sm text-muted-foreground">For the builders at Thapar.</p>
        <a href="mailto:multimodexai@gmail.com" className="mt-3 inline-flex items-center gap-2 break-all text-sm text-gold hover:underline"><Mail className="h-4 w-4 shrink-0" />multimodexai@gmail.com</a>
      </div>
      <nav aria-label="Footer" className="flex flex-wrap items-start gap-x-5 gap-y-3 text-sm text-muted-foreground">
        <Link to="/">Hackathons</Link><Link to="/team-builder" search={{ post: undefined }}>Teams</Link>
        <Link to="/privacy">Privacy policy</Link><Link to="/terms">Terms & conditions</Link>
      </nav>
    </div>
    <p className="mx-auto mt-6 max-w-6xl text-xs text-muted-foreground">© {new Date().getFullYear()} HackHub. Independent student platform; not an official TIET service.</p>
  </footer>;
}