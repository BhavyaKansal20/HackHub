import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

export function TagInput({ value, onChange, suggestions = [], placeholder }: { value: string[]; onChange: (v: string[]) => void; suggestions?: string[]; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  const add = (t: string) => { const v = t.trim(); if (v && !value.some((x) => x.toLowerCase() === v.toLowerCase()) && value.length < 30) onChange([...value, v]); setDraft(""); };
  const open = suggestions.filter((s) => !value.includes(s) && s.toLowerCase().includes(draft.toLowerCase())).slice(0, 12);
  return (
    <div>
      <div className="neo-inset flex flex-wrap gap-1.5 rounded-3xl p-2">
        {value.map((t) => (
          <span key={t} className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground">
            {t}<button type="button" onClick={() => onChange(value.filter((x) => x !== t))} aria-label={`Remove ${t}`}><X className="h-3 w-3" /></button>
          </span>
        ))}
        <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={placeholder}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(draft); } }}
          className="h-8 min-w-40 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0" />
      </div>
      {!!open.length && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {open.map((s) => <button type="button" key={s} onClick={() => add(s)} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground hover:border-gold hover:text-foreground">+ {s}</button>)}
        </div>
      )}
    </div>
  );
}
