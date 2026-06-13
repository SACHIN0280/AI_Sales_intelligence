"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot, User, Send, Mic, Paperclip, Sparkles, Copy, Check,
  ChevronRight, TrendingUp, Mail, BarChart2, Target, Zap, RefreshCw,
  Trash2, Plus, MessageSquare, MoreHorizontal, Edit2, Pin, Archive, Share, X
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

// ─── Types ───────────────────────────────────────────────────────────────────
type CardType = "lead_analysis" | "email_draft" | "analytics" | "recommendations" | null;

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  card?: CardType;
  leadData?: any;
  isTyping?: boolean;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: string;
  isPinned?: boolean;
  isArchived?: boolean;
}

// ─── Suggestion Tiles ─────────────────────────────────────────────────────────
const SUGGESTIONS = [
  { icon: Zap,       label: "Analyze pipeline risk",    prompt: "Analyze pipeline risk and identify stalled enterprise deals.",       color: "#10b981" },
  { icon: Target,    label: "Generate executive brief", prompt: "Generate an executive brief for the Stripe deal.", color: "#3b82f6" },
  { icon: Mail,      label: "Draft follow-up email",    prompt: "Draft a personalized follow-up email for Microsoft.", color: "#8b5cf6" },
  { icon: BarChart2, label: "Competitor battlecard",    prompt: "Create a competitor battlecard against HubSpot.",        color: "#06b6d4" },
];

// ─── AI Responses Map ─────────────────────────────────────────────────────────
async function getAIDatabaseResponse(text: string): Promise<{ text: string; card: CardType; leadData?: any } | null> {
  const lower = text.toLowerCase();
  
  if (text === "Analyze pipeline risk and identify stalled enterprise deals.") {
    return {
      card: "recommendations",
      text: "I've scanned your live pipeline for enterprise-tier risk signals. Based on recent telemetry and procurement tracking, I've identified 3 critical high-value deals that are currently stalling:\n\n**1. Microsoft ($1.2M)** — Stalled in procurement for >30 days. No VP of Engineering engagement.\n**2. Salesforce ($800K)** — Strong competitor presence detected. Activity dropped by 40% this month.\n**3. Airbnb ($450K)** — Internal tooling budget temporarily frozen.\n\n**Strategic Recommendation:** Engage Satya Nadella (Microsoft) from top-down immediately to unblock procurement. I've prepared specific actions below:",
    };
  }

  if (text === "Generate an executive brief for the Stripe deal.") {
    return {
      card: "lead_analysis",
      leadData: { account: "Stripe", ai_score: 98, estimated_value: 600, status: "Enterprise Close", days_in_stage: 7 },
      text: "The Stripe deal is currently your highest-propensity enterprise target. They have extreme urgency due to their Q3 global rollout. \n\n**Key Intelligence:**\n- **Champion:** Patrick Collison (Strong buy-in)\n- **Blocker:** Legal Review\n- **Next Step:** Send the SOC2 Type II compliance report.\n\nHere is the AI-generated scoring breakdown:",
    };
  }

  if (text === "Draft a personalized follow-up email for Microsoft.") {
    return {
      card: "email_draft",
      text: "Based on our last Executive Sync with Satya Nadella, the deal is stalled in procurement. I have drafted a highly targeted follow-up designed to bypass procurement by establishing top-down urgency with the VP of Engineering.",
    };
  }

  if (text === "Create a competitor battlecard against HubSpot.") {
    return {
      card: "analytics",
      text: "**SalesMind AI vs. HubSpot — Battlecard**\n\nWhen competing against HubSpot, focus on our **Predictive AI Engine**. HubSpot requires manual data entry and rule-based workflows, whereas SalesMind uses autonomous agentic scoring.\n\n**Key Traps to Set:**\n1. Ask the prospect: *'How many hours does your team spend manually updating deal stages?'*\n2. Ask the prospect: *'Are you using retroactive analytics, or predictive pipeline forecasting?'*\n\nOur win-rate against HubSpot increases by 42% when we demo the live Copilot.",
    };
  }
  
  // Return null if no specific intercept matched, so the live LLM can handle it
  return null;
}

// ─── Inline Card Components ────────────────────────────────────────────────
function LeadAnalysisCard({ leadData }: { leadData?: any }) {
  const lead = leadData ? {
    name: "Unknown Contact",
    company: leadData.account,
    title: "Decision Maker",
    score: leadData.ai_score,
    dealValue: `$${leadData.estimated_value}k`,
    lastContact: `${leadData.days_in_stage} days ago`,
    status: leadData.status,
    nextAction: "Send proposal",
  } : {
    name: "Noah Williams",
    company: "Stripe",
    title: "Head of Sales",
    score: 94,
    dealValue: "$85,000",
    lastContact: "2 hours ago",
    status: "Hot Lead",
    nextAction: "Send proposal",
  };

  const rows = [
    { label: "Company",      value: lead.company },
    { label: "Title",        value: lead.title },
    { label: "Deal Value",   value: lead.dealValue },
    { label: "Last Contact", value: lead.lastContact },
    { label: "Status",       value: lead.status },
    { label: "Next Action",  value: lead.nextAction },
  ];

  return (
    <div
      className="glass-card"
      style={{ padding: 20, marginTop: 8, borderRadius: 14 }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Target size={16} color="#7c5cfc" />
        <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>Lead Analysis</span>
      </div>

      {/* Score */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 0",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: 12, color: "#555" }}>AI Score</span>
        <span style={{ fontSize: 28, fontWeight: 500, color: "#7c5cfc", lineHeight: 1 }}>
          {lead.score}
        </span>
      </div>

      {/* Data rows */}
      {rows.map(({ label, value }) => (
        <div
          key={label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 0",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <span style={{ fontSize: 12, color: "#555" }}>{label}</span>
          <span style={{ fontSize: 14, color: "#fff" }}>{value}</span>
        </div>
      ))}

      {/* CTA */}
      <button
        style={{
          width: "100%",
          marginTop: 14,
          background: "#13131f",
          border: "1px solid rgba(124,92,252,0.2)",
          borderRadius: 8,
          padding: "8px 0",
          fontSize: 14,
          color: "#a78bfa",
          cursor: "pointer",
          transition: "background 0.15s ease",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1a1a2e")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#13131f")}
      >
        View Full Profile
      </button>
    </div>
  );
}

function EmailDraftCard() {
  const [copied, setCopied] = useState(false);
  const emailText = `Subject: Quick question about your sales workflow at Stripe

Hi Noah,

I noticed Stripe's sales team has scaled rapidly this quarter — impressive growth. Many companies at your stage run into CRM bottlenecks that slow conversion velocity.

SalesMind AI automates lead scoring and personalized outreach, helping reps like yours recover 8+ hours/week. We've seen teams at similar stages improve close rates by 34%.

Would you be open to a 15-minute conversation next Tuesday or Wednesday?

Best,
[Your Name]`;

  const handleCopy = () => {
    navigator.clipboard.writeText(emailText);
    setCopied(true);
    toast.success("Email copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const pillBtn: React.CSSProperties = {
    background: "transparent",
    border: "1px solid #2a2a2a",
    borderRadius: 9999,
    padding: "5px 14px",
    fontSize: 12,
    color: "#777",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 5,
    transition: "border-color 0.15s ease, color 0.15s ease",
  };

  return (
    <div
      className="glass-card"
      style={{ padding: 20, marginTop: 8, borderRadius: 14 }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        {/* Left: icon + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Mail size={16} color="#a78bfa" />
          <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>AI Email Draft</span>
        </div>

        {/* Right: tone badge + copy button */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              background: "#1a1a2e",
              border: "1px solid rgba(139,92,246,0.3)",
              color: "#a78bfa",
              fontSize: 12,
              padding: "4px 12px",
              borderRadius: 9999,
            }}
          >
            Professional tone
          </span>
          <button
            onClick={handleCopy}
            style={pillBtn}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#7c5cfc";
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#2a2a2a";
              (e.currentTarget as HTMLElement).style.color = "#777";
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Email body — plain div, Inter font, NOT monospace */}
      <div
        style={{
          fontFamily: "Inter, -apple-system, sans-serif",
          fontSize: 13,
          lineHeight: 1.9,
          color: "#c8c8c8",
          whiteSpace: "pre-wrap",
        }}
      >
        {emailText}
      </div>

      {/* Action buttons */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 14,
          paddingTop: 14,
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {[
          { label: "Regenerate", icon: <RefreshCw size={12} /> },
          { label: "Friendly tone", icon: null },
          { label: "Shorter", icon: null },
        ].map(({ label, icon }) => (
          <button
            key={label}
            style={pillBtn}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#7c5cfc";
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#2a2a2a";
              (e.currentTarget as HTMLElement).style.color = "#777";
            }}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function AnalyticsCard() {
  const channels = [
    { name: "Email Campaigns",   pct: 72, value: "$284K", color: "#3b82f6" },
    { name: "LinkedIn Outreach", pct: 54, value: "$189K", color: "#8b5cf6" },
    { name: "Organic Inbound",   pct: 41, value: "$143K", color: "#06b6d4" },
    { name: "Referral Program",  pct: 28, value: "$98K",  color: "#10b981" },
  ];

  return (
    <div
      className="glass-card"
      style={{ padding: 20, marginTop: 8, borderRadius: 14 }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <BarChart2 size={16} color="#06b6d4" />
        <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>Conversion by Channel</span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            fontFamily: "JetBrains Mono, monospace",
            color: "#22d3ee",
          }}
        >
          Q3 2024
        </span>
      </div>

      {/* Channel rows */}
      {channels.map(({ name, pct, value, color }, i) => (
        <div
          key={name}
          style={{
            padding: "8px 0",
            borderBottom:
              i < channels.length - 1
                ? "1px solid rgba(255,255,255,0.05)"
                : "none",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 12, color: "#888" }}>{name}</span>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span
                style={{
                  fontSize: 12,
                  fontFamily: "JetBrains Mono, monospace",
                  color,
                }}
              >
                {pct}%
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontFamily: "JetBrains Mono, monospace",
                  color: "#555",
                }}
              >
                {value}
              </span>
            </div>
          </div>
          {/* Progress bar */}
          <div
            style={{
              height: 4,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 9999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: color,
                borderRadius: 9999,
                boxShadow: `0 0 6px ${color}80`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function RecommendationsCard({ riskData }: { riskData?: any[] }) {
  const recs = riskData ? riskData.map((l: any, i: number) => ({
    icon: i === 0 ? "🔥" : i === 1 ? "⚡" : "📧",
    text: `Re-engage decision maker at ${l.account} — deal stalled for ${l.days_in_stage} days.`,
    priority: "HIGH"
  })) : [
    { icon: "🔥", text: "Engage Satya Nadella (Microsoft) top-down to unblock procurement.",   priority: "HIGH" },
    { icon: "⚡", text: "Schedule battlecard review for Salesforce deal to counter competitor.", priority: "HIGH" },
    { icon: "📧", text: "Send ROI calculator to Airbnb to justify budget approval.",       priority: "MED"  },
    { icon: "📊", text: "Expand LinkedIn outreach to alternative Enterprise targets.",       priority: "MED"  },
  ];

  return (
    <div
      className="glass-card"
      style={{ padding: 20, marginTop: 8, borderRadius: 14 }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Zap size={16} color="#10b981" />
        <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>Strategic Recommendations</span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            fontFamily: "JetBrains Mono, monospace",
            color: "#10b981",
          }}
        >
          {recs.length} actions
        </span>
      </div>

      {/* Rec rows */}
      {recs.map(({ icon, text, priority }, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            padding: "8px 0",
            borderBottom:
              i < recs.length - 1
                ? "1px solid rgba(255,255,255,0.05)"
                : "none",
          }}
        >
          <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{icon}</span>
          <span
            style={{
              flex: 1,
              fontSize: 13,
              color: "#c8c8c8",
              lineHeight: 1.6,
            }}
          >
            {text}
          </span>
          <span
            style={{
              fontSize: 10,
              fontFamily: "JetBrains Mono, monospace",
              padding: "2px 8px",
              borderRadius: 4,
              flexShrink: 0,
              background:
                priority === "HIGH"
                  ? "rgba(239,68,68,0.1)"
                  : "rgba(245,158,11,0.1)",
              border:
                priority === "HIGH"
                  ? "1px solid rgba(239,68,68,0.25)"
                  : "1px solid rgba(245,158,11,0.25)",
              color: priority === "HIGH" ? "#fca5a5" : "#fcd34d",
            }}
          >
            {priority}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Typing Animation ─────────────────────────────────────────────────────────
function TypingMessage({ text, onDone }: { text: string; onDone: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (idx < text.length) {
      const t = setTimeout(() => { setDisplayed(prev => prev + text[idx]); setIdx(i => i+1); }, 14);
      return () => clearTimeout(t);
    } else {
      onDone();
    }
  }, [idx, text, onDone]);

  return <span className="whitespace-pre-wrap">{displayed}<span className="typing-cursor" /></span>;
}

const menuBtnStyle = {
  width: "100%", display: "flex", alignItems: "center", gap: 10, background: "transparent", border: "none", color: "#d0d0d0", 
  padding: "8px 10px", fontSize: 13, borderRadius: 6, cursor: "pointer", textAlign: "left" as const, transition: "all 0.2s"
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function CopilotPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Context Menu State
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  // Close menu on outside click
  useEffect(() => {
    const handleClick = () => setMenuOpenId(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("salesmind_copilot_chats");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConversations(parsed);
        // Do not auto-select the latest conversation so they always start fresh
      } catch (e) {}
    }
  }, []);

  const startNewConversation = () => {
    setActiveConversationId(null);
    setMessages([]);
    setShowWelcome(true);
  };

  const switchConversation = (id: string) => {
    const conv = conversations.find(c => c.id === id);
    if (conv) {
      setActiveConversationId(id);
      setMessages(conv.messages);
      setShowWelcome(conv.messages.length === 0);
    }
  };

  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(prev => {
      const next = prev.filter(c => c.id !== id);
      localStorage.setItem("salesmind_copilot_chats", JSON.stringify(next));
      return next;
    });
    if (activeConversationId === id) {
      startNewConversation();
    }
    setMenuOpenId(null);
  };

  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(prev => {
      const next = prev.map(c => c.id === id ? { ...c, isPinned: !c.isPinned } : c);
      localStorage.setItem("salesmind_copilot_chats", JSON.stringify(next));
      return next;
    });
    setMenuOpenId(null);
  };

  const toggleArchive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(prev => {
      const next = prev.map(c => c.id === id ? { ...c, isArchived: !c.isArchived, isPinned: false } : c);
      localStorage.setItem("salesmind_copilot_chats", JSON.stringify(next));
      return next;
    });
    setMenuOpenId(null);
  };

  const startRename = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingId(id);
    setRenameInput(currentTitle);
    setMenuOpenId(null);
  };

  const saveRename = (id: string, e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.stopPropagation();
    if (!renameInput.trim()) {
      setRenamingId(null);
      return;
    }
    setConversations(prev => {
      const next = prev.map(c => c.id === id ? { ...c, title: renameInput } : c);
      localStorage.setItem("salesmind_copilot_chats", JSON.stringify(next));
      return next;
    });
    setRenamingId(null);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setShowWelcome(false);

    let currentId = activeConversationId;
    if (!currentId) {
      currentId = Date.now().toString();
      setActiveConversationId(currentId);
    }

    const userMsg: Message = { id: Date.now().toString(), sender: "user", text, timestamp: new Date() };
    
    const updateMsgs = (newMsg: Message) => {
      setMessages(prev => {
        const nextMsgs = [...prev, newMsg];
        setConversations(prevConvs => {
          let nextConvs = [...prevConvs];
          const idx = nextConvs.findIndex(c => c.id === currentId);
          if (idx !== -1) {
            nextConvs[idx] = { ...nextConvs[idx], messages: nextMsgs, updatedAt: new Date().toISOString() };
            if (idx !== 0) {
              const [moved] = nextConvs.splice(idx, 1);
              nextConvs.unshift(moved);
            }
          } else {
            const title = nextMsgs[0]?.text.slice(0, 30) + (nextMsgs[0]?.text.length > 30 ? "..." : "") || "New Conversation";
            nextConvs.unshift({ id: currentId as string, title, messages: nextMsgs, updatedAt: new Date().toISOString() });
          }
          localStorage.setItem("salesmind_copilot_chats", JSON.stringify(nextConvs));
          return nextConvs;
        });
        return nextMsgs;
      });
    };

    updateMsgs(userMsg);
    setInput("");
    setIsLoading(true);

    if (textareaRef.current) { textareaRef.current.style.height = "auto"; }

    // Check if we have a direct database intercept for this query
    const dbIntercept = await getAIDatabaseResponse(text);
    if (dbIntercept) {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(), sender: "ai", text: dbIntercept.text,
        card: dbIntercept.card, leadData: dbIntercept.leadData, isTyping: true, timestamp: new Date(),
      };
      updateMsgs(aiMsg);
      setIsLoading(false);
      return;
    }

    // Build history from current messages for multi-turn context
    const history = messages.map(m => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));

    try {
      const { reply } = await api.ai.chatWithCopilot(text, history);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(), sender: "ai", text: reply,
        card: null, isTyping: true, timestamp: new Date(),
      };
      updateMsgs(aiMsg);
    } catch {
      // Complete fallback
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(), sender: "ai", text: "I'm sorry, I cannot connect to the LLM backend right now.",
        card: null, isTyping: true, timestamp: new Date(),
      };
      updateMsgs(aiMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(input); }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "row", overflow: "hidden" }}>
      
      {/* ── SUB-SIDEBAR ── */}
      <div style={{ width: 260, background: "#0e0e0e", borderRight: "1px solid #1c1c1c", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: 16 }}>
          <button 
            onClick={startNewConversation}
            style={{ width: "100%", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px", color: "#f0f0f0", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <Plus size={16} />
            New Chat
          </button>
        </div>
        
        {/* ── Chat List ── */}
        {(() => {
          const pinnedChats = conversations.filter(c => c.isPinned && !c.isArchived);
          const recentChats = conversations.filter(c => !c.isPinned && !c.isArchived);
          const archivedChats = conversations.filter(c => c.isArchived);

          const renderChatItem = (conv: Conversation) => {
            const active = activeConversationId === conv.id;
            const isRenaming = renamingId === conv.id;
            const isMenuOpen = menuOpenId === conv.id;
            
            return (
              <div key={conv.id} style={{ position: "relative" }}>
                <div 
                  onClick={() => !isRenaming && switchConversation(conv.id)}
                  style={{ 
                    padding: "10px 12px", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: active || isMenuOpen ? "rgba(124, 92, 252, 0.1)" : "transparent",
                    color: active || isMenuOpen ? "#fff" : "#a0a0a0", cursor: "pointer", marginBottom: 2,
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={e => { if (!active && !isMenuOpen) e.currentTarget.style.background = "rgba(255,255,255,0.03)" }}
                  onMouseLeave={e => { if (!active && !isMenuOpen) e.currentTarget.style.background = "transparent" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden", flex: 1 }}>
                    <MessageSquare size={14} color={active || isMenuOpen ? "#a78bfa" : "#555"} style={{ flexShrink: 0 }} />
                    {isRenaming ? (
                      <input 
                        autoFocus
                        value={renameInput}
                        onChange={e => setRenameInput(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") saveRename(conv.id, e); if (e.key === "Escape") setRenamingId(null); }}
                        onBlur={() => saveRename(conv.id)}
                        onClick={e => e.stopPropagation()}
                        style={{ background: "transparent", border: "1px solid #7c5cfc", color: "#fff", outline: "none", fontSize: 13, width: "100%", borderRadius: 4, padding: "2px 4px" }}
                      />
                    ) : (
                      <div style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {conv.title}
                      </div>
                    )}
                  </div>
                  
                  {!isRenaming && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setMenuOpenId(isMenuOpen ? null : conv.id); }}
                      style={{ background: "none", border: "none", color: active || isMenuOpen ? "#fff" : "#555", cursor: "pointer", padding: 4, transition: "color 0.2s", opacity: active || isMenuOpen ? 1 : 0 }}
                      className="group-hover:opacity-100"
                      onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                      onMouseLeave={e => e.currentTarget.style.color = active || isMenuOpen ? "#fff" : "#555"}
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  )}
                </div>

                {isMenuOpen && (
                  <div style={{
                    position: "absolute", top: 36, right: 12, width: 180, background: "rgba(20,20,25,0.95)", backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 6, zIndex: 100,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.05)"
                  }}>
                    <button style={menuBtnStyle} onClick={(e) => { e.stopPropagation(); toast("Link copied to clipboard!"); setMenuOpenId(null); }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <Share size={14} /> Share
                    </button>
                    <button style={menuBtnStyle} onClick={(e) => startRename(conv.id, conv.title, e)} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <Edit2 size={14} /> Rename
                    </button>
                    <button style={menuBtnStyle} onClick={(e) => togglePin(conv.id, e)} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <Pin size={14} /> {conv.isPinned ? "Unpin chat" : "Pin chat"}
                    </button>
                    <button style={menuBtnStyle} onClick={(e) => { toggleArchive(conv.id, e); toast(conv.isArchived ? "Chat unarchived!" : "Chat archived."); }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <Archive size={14} /> {conv.isArchived ? "Unarchive" : "Archive"}
                    </button>
                    <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "4px 0" }} />
                    <button 
                      style={{ ...menuBtnStyle, color: "#ef4444" }} 
                      onClick={(e) => deleteConversation(conv.id, e)}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#ef4444"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#ef4444"; }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            );
          };

          return (
            <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 16px" }}>
              {pinnedChats.length > 0 && (
                <>
                  <div style={{ padding: "0 8px", fontSize: 11, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, marginTop: 8 }}>Pinned</div>
                  {pinnedChats.map(renderChatItem)}
                </>
              )}

              <div style={{ padding: "0 8px", fontSize: 11, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, marginTop: pinnedChats.length ? 16 : 8 }}>Recent</div>
              {recentChats.map(renderChatItem)}

              {archivedChats.length > 0 && (
                <div style={{ marginTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 16 }}>
                  <div 
                    onClick={() => setShowArchived(!showArchived)}
                    style={{ padding: "0 8px", fontSize: 11, fontWeight: 600, color: "#777", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
                  >
                    Archived ({archivedChats.length})
                    <ChevronRight size={14} style={{ transform: showArchived ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                  </div>
                  {showArchived && archivedChats.map(renderChatItem)}
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* ── MAIN CHAT AREA ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#111118", position: "relative" }}>



      {/* ── Messages ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Welcome State */}
          {showWelcome && (
            <div className="animate-fade-in" style={{ paddingTop: 32, paddingBottom: 16 }}>
              {/* Hero */}
              <div style={{ textAlign: "center", marginBottom: 40 }}>
                <div style={{ position: "relative", display: "inline-flex", marginBottom: 24 }}>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 20,
                      background: "#7c5cfc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#fff",
                      letterSpacing: "0.03em",
                      boxShadow: "0 0 40px rgba(124,92,252,0.4)",
                    }}
                  >
                    SM
                  </div>
                  <span
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#10b981",
                      border: "2px solid #0a0a0a",
                      boxShadow: "0 0 8px rgba(16,185,129,0.8)",
                    }}
                  />
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 10, letterSpacing: "-0.02em" }}>
                  How can I help you today?
                </h1>
                <p style={{ fontSize: 13, color: "#666", maxWidth: 380, margin: "0 auto", lineHeight: 1.7 }}>
                  I'm your AI sales copilot. Ask me to analyze leads, draft emails, generate reports, or surface insights from your pipeline.
                </p>
              </div>

              {/* Suggestion Tiles */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {SUGGESTIONS.map(({ icon: Icon, label, prompt, color }) => (
                  <button
                    key={label}
                    onClick={() => handleSend(prompt)}
                    style={{
                      textAlign: "left",
                      padding: 16,
                      borderRadius: 12,
                      background: "#111",
                      border: "1px solid #1e1e1e",
                      cursor: "pointer",
                      transition: "border-color 0.15s, background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = color + "50";
                      (e.currentTarget as HTMLElement).style.background = color + "0a";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#1e1e1e";
                      (e.currentTarget as HTMLElement).style.background = "#111";
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        background: color + "20",
                        border: `1px solid ${color}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 10,
                      }}
                    >
                      <Icon size={15} color={color} />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#e0e0e0", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 11, color: "#555", lineHeight: 1.5 }}>{prompt}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Thread */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="animate-slide-up"
              style={{
                display: "flex",
                flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              {/* Avatar */}
              {msg.sender === "ai" ? (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: "#7c5cfc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "0.03em",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  SM
                </div>
              ) : (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#2a2a3e",
                    border: "1px solid #3a3a4e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#888",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  SA
                </div>
              )}

              {/* Content */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "75%",
                }}
              >
                {msg.sender === "user" ? (
                  /* User bubble */
                  <div
                    style={{
                      background: "#1e1e2e",
                      borderRadius: "18px 18px 4px 18px",
                      padding: "10px 16px",
                      fontSize: 14,
                      color: "#fff",
                      lineHeight: 1.6,
                      marginLeft: "auto",
                    }}
                  >
                    {msg.text}
                  </div>
                ) : (
                  /* AI message — no bubble */
                  <div
                    style={{
                      fontSize: 14,
                      color: "#d4d4d4",
                      lineHeight: 1.8,
                    }}
                  >
                    {msg.isTyping ? (
                      <TypingMessage
                        text={msg.text}
                        onDone={() =>
                          setMessages((prev) =>
                            prev.map((m) => (m.id === msg.id ? { ...m, isTyping: false } : m))
                          )
                        }
                      />
                    ) : (
                      <span style={{ whiteSpace: "pre-wrap" }}>{msg.text}</span>
                    )}
                  </div>
                )}

                {/* Inline Cards — only for AI messages */}
                <div style={{ marginTop: 16 }}>
                  {msg.card === "lead_analysis" && !msg.isTyping && <LeadAnalysisCard leadData={msg.leadData} />}
                  {msg.card === "email_draft" && !msg.isTyping && <EmailDraftCard />}
                  {msg.card === "analytics" && !msg.isTyping && <AnalyticsCard />}
                  {msg.card === "recommendations" && !msg.isTyping && <RecommendationsCard riskData={msg.leadData} />}
                </div>

                <span style={{ fontSize: 10, color: "#333", marginTop: 6, paddingLeft: 2 }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}

          {/* Loading dots */}
          {isLoading && (
            <div className="animate-fade-in" style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  background: "#7c5cfc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                SM
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, paddingTop: 6 }}>
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="animate-bounce"
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#7c5cfc",
                      display: "inline-block",
                      animationDelay: `${delay}ms`,
                      opacity: 0.7,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Input Bar ── */}
      <div
        style={{
          background: "#0a0a0a",
          borderTop: "1px solid #1c1c1c",
          padding: "12px 24px 20px",
          position: "sticky",
          bottom: 0,
          flexShrink: 0,
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          {/* Suggestion chips */}
          {!showWelcome && messages.length > 0 && (
            <div style={{ display: "flex", gap: 8, marginBottom: 10, overflowX: "auto", flexWrap: "nowrap" }}>
              {["Summarize pipeline", "Draft next steps", "Show analytics", "Identify risks"].map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  style={{
                    flexShrink: 0,
                    background: "#161616",
                    border: "1px solid #252525",
                    borderRadius: 9999,
                    padding: "6px 14px",
                    fontSize: 12,
                    color: "#666",
                    cursor: "pointer",
                    transition: "border-color 0.15s, color 0.15s",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#7c5cfc";
                    (e.currentTarget as HTMLElement).style.color = "#ccc";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#252525";
                    (e.currentTarget as HTMLElement).style.color = "#666";
                  }}
                >
                  <Sparkles size={11} color="currentColor" />
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input pill */}
          <div
            style={{
              background: "#161616",
              border: "1px solid #2a2a2a",
              borderRadius: 9999,
              padding: "8px 8px 8px 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onFocusCapture={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "#7c5cfc";
              el.style.boxShadow = "0 0 0 3px rgba(124,92,252,0.1)";
            }}
            onBlurCapture={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "#2a2a2a";
              el.style.boxShadow = "none";
            }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask SalesMind AI anything…"
              rows={1}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                resize: "none",
                fontSize: 14,
                color: "#e0e0e0",
                lineHeight: 1.5,
                maxHeight: 120,
                padding: "4px 0",
                fontFamily: "Inter, -apple-system, sans-serif",
              }}
              // @ts-ignore
              placeholder-style={{ color: "#444" }}
            />

            {/* Mic */}
            <button
              style={{
                background: "transparent",
                border: "none",
                padding: 6,
                cursor: "pointer",
                color: "#444",
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#888")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#444")}
            >
              <Mic size={16} />
            </button>

            {/* Send button */}
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isLoading}
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: input.trim() && !isLoading ? "#7c5cfc" : "#2a2a2a",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
                flexShrink: 0,
                transition: "background 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                if (input.trim() && !isLoading) {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 14px rgba(124,92,252,0.4)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <Send size={14} color={input.trim() && !isLoading ? "#fff" : "#555"} />
            </button>
          </div>

          <div style={{ fontSize: 10, color: "#333", textAlign: "center", marginTop: 8 }}>
            SalesMind AI can make mistakes. Review important information.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
