import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Bot,
  Sparkles,
  Send,
  X,
  Minimize2,
  Copy,
  Check,
  RotateCcw,
  FileText,
  Lightbulb,
  Compass,
  Users,
  ChevronDown,
} from "lucide-react";
import { chatWithHackBot, getHackBotEngineStatus, type HackBotStatus } from "@/lib/hub.functions";
import { useSession } from "@/lib/session";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  {
    icon: Lightbulb,
    label: "Brainstorm Ideas",
    prompt: "Brainstorm 3 winning hackathon project ideas with full system architecture and tech stack for HackTU 8.0.",
  },
  {
    icon: Compass,
    label: "Match My Stack",
    prompt: "Based on React, Python, and AI, which upcoming hackathons on Devfolio and Unstop should I apply for?",
  },
  {
    icon: FileText,
    label: "Draft OD Leave",
    prompt: "Draft an official On-Duty (OD) leave application for TIET DoSA and my HOD for an upcoming hackathon.",
  },
  {
    icon: Users,
    label: "Teammate Pitch",
    prompt: "Write a high-converting recruitment pitch to find a frontend and design teammate for our hackathon team.",
  },
];

export function HackBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 **Hey Builder! I'm HACKBOT**, your local HackHub AI copilot.\n\nI can help you find high-prize hackathons, brainstorm winning project architectures, draft official TIET On-Duty (OD) slips for DoSA, and craft teammate recruitment pitches.\n\n*Click a quick prompt below or ask me anything!*",
      timestamp: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useSession();

  // Engine status check
  const statusFn = useServerFn(getHackBotEngineStatus);
  const { data: status } = useQuery<HackBotStatus>({
    queryKey: ["hackbot-status"],
    queryFn: () => statusFn(),
    refetchInterval: 30000,
  });

  // Chat mutation
  const chatFn = useServerFn(chatWithHackBot);
  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }));
      return await chatFn({
        data: {
          message: userMessage,
          history,
          userContext: user
            ? {
                skills: (user as any).skills || ["React", "Python"],
                branch: (user as any).branch || "Computer Engineering",
                year: (user as any).current_year || 2,
              }
            : undefined,
        },
      });
    },
    onSuccess: (botReply) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    },
    onError: (err) => {
      toast.error("HACKBOT encountered a temporary issue. Please retry.");
      console.error(err);
    },
  });

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || chatMutation.isPending) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    chatMutation.mutate(text);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        content: "Chat cleared! How can HACKBOT assist your hackathon journey right now?",
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Expanded Chat Modal */}
      {isOpen && (
        <div className="clay mb-3 flex h-[580px] max-h-[85vh] w-[360px] sm:w-[440px] flex-col overflow-hidden rounded-[2rem] border border-gold/30 bg-background/95 shadow-2xl backdrop-blur-2xl transition-all animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-glass-border/60 bg-accent/40 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gold-gradient text-background shadow-md">
                <Bot className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                      status?.online ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                  />
                  <span
                    className={`relative inline-flex h-3 w-3 rounded-full ${
                      status?.online ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-bold text-foreground">HACKBOT</h3>
                  <span className="rounded-full bg-gold/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-gold border border-gold/20">
                    COPILOT
                  </span>
                </div>
                <p className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
                  {status?.online ? (
                    <span className="text-emerald-400 font-medium">● Local Qwen LLM Connected</span>
                  ) : (
                    <span className="text-amber-400 font-medium">● HACKBOT Standby Engine</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClear}
                title="Clear conversation"
                className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimize HACKBOT"
                className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="flex gap-1.5 overflow-x-auto border-b border-glass-border/40 bg-accent/20 px-4 py-2 scrollbar-none">
            {QUICK_PROMPTS.map((qp, idx) => {
              const Icon = qp.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(qp.prompt)}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-glass-border/60 bg-background/50 px-3 py-1 text-[11px] font-medium text-muted-foreground transition hover:border-gold/40 hover:text-gold hover:bg-gold/5"
                >
                  <Icon className="h-3 w-3 text-gold" />
                  <span>{qp.label}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4 text-xs leading-relaxed">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`group relative max-w-[90%] rounded-2xl px-4 py-3 ${
                    m.role === "user"
                      ? "rounded-tr-sm bg-primary text-primary-foreground shadow-sm"
                      : "clay rounded-tl-sm border border-glass-border/60 bg-accent/30 text-foreground"
                  }`}
                >
                  {/* Markdown-style content parsing */}
                  <div className="whitespace-pre-wrap space-y-1">
                    {m.content.split("\n\n").map((para, i) => (
                      <p key={i}>
                        {para.split("**").map((chunk, j) =>
                          j % 2 === 1 ? <strong key={j} className="text-gold font-semibold">{chunk}</strong> : chunk
                        )}
                      </p>
                    ))}
                  </div>

                  {/* Message footer with copy button */}
                  <div
                    className={`mt-2 flex items-center justify-between text-[10px] ${
                      m.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    {m.role === "assistant" && (
                      <button
                        type="button"
                        onClick={() => handleCopy(m.id, m.content)}
                        className="ml-2 inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-gold transition"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {chatMutation.isPending && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="grid h-7 w-7 place-items-center rounded-xl bg-gold/10 text-gold border border-gold/20">
                  <Bot className="h-4 w-4 animate-bounce" />
                </div>
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                  <span className="h-2 w-2 rounded-full bg-gold animate-pulse delay-150" />
                  <span className="h-2 w-2 rounded-full bg-gold animate-pulse delay-300" />
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">HACKBOT is generating response…</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-glass-border/60 bg-accent/30 p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask HACKBOT (e.g. 'Recommend AI hackathons')..."
              className="flex-1 rounded-full border border-glass-border/70 bg-background/80 px-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
            <button
              type="submit"
              disabled={!input.trim() || chatMutation.isPending}
              aria-label="Send message to HACKBOT"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-gradient text-background transition hover:opacity-90 disabled:opacity-40 shadow-md"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle HACKBOT AI Assistant"
        className="group relative flex items-center gap-2.5 rounded-full border border-gold/40 bg-background/90 px-4 py-3 shadow-[0_0_25px_rgba(234,179,8,0.25)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-gold hover:shadow-[0_0_35px_rgba(234,179,8,0.4)]"
      >
        <div className="relative grid h-8 w-8 place-items-center rounded-xl bg-gold-gradient text-background font-bold shadow-md">
          <Bot className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                status?.online ? "bg-emerald-400" : "bg-gold"
              }`}
            />
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                status?.online ? "bg-emerald-500" : "bg-gold"
              }`}
            />
          </span>
        </div>

        <div className="text-left hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className="font-display text-xs font-bold text-foreground">HACKBOT AI</span>
            <span className="rounded-full bg-gold/15 px-1.5 py-0.2 font-mono text-[9px] font-semibold text-gold">
              LOCAL
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-tight">
            {isOpen ? "Click to minimize" : "Hackathon Copilot"}
          </p>
        </div>

        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
        ) : (
          <Sparkles className="h-4 w-4 text-gold group-hover:rotate-12 transition" />
        )}
      </button>
    </div>
  );
}
