"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FileText, Search, Mic, Users, TrendingUp,
  BookOpen, Brain, Send, CheckSquare, Hash,
  Star, Plus, MoreHorizontal, ChevronRight, Zap
} from "lucide-react";
import { api } from "@/lib/api";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Doc {
  id: string;
  title: string;
  category: string;
  preview: string;
  tags: string[];
  client: string;
  edited: string;
  status: "active" | "draft";
  pinned?: boolean;
  transcriptData?: any[];
}
interface AiMessage {
  role: "user" | "ai";
  text: string;
  cards?: { label: string; value: string; color: string }[];
}

const CATEGORIES = [
  { id: "Meeting Notes",    label: "Meetings",    icon: Mic,       color: "#4f7bff" },
  { id: "AI Summaries",     label: "Insights",    icon: Brain,     color: "#34d399" },
  { id: "Reports",          label: "Reports",     icon: BookOpen,  color: "#fb7185" },
];

const PROMPT_CHIPS = ["Summarize objections", "Extract action items", "Find decision makers", "Identify risks"];

const glow = (color: string, px = 16) => `0 0 ${px}px ${color}`;

// ─── Page ────────────────────────────────────────────────────────────────────
export default function DocsPage() {
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState<Doc[]>([]);
  
  const [activeCat, setActiveCat]   = useState("Meeting Notes");
  const [activeDoc, setActiveDoc]   = useState<Doc | null>(null);
  const [search,    setSearch]      = useState("");
  
  const [aiMsgs,    setAiMsgs]      = useState<AiMessage[]>([]);
  const [aiInput,   setAiInput]     = useState("");
  const [aiTyping,  setAiTyping]    = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [transRes, actRes] = await Promise.all([
          api.signal.transcripts(),
          api.signal.activities()
        ]);

        const loadedDocs: Doc[] = [];

        // Map transcripts to Meeting Notes
        if (transRes.transcripts) {
          transRes.transcripts.forEach((t: any) => {
            loadedDocs.push({
              id: t.meeting_id,
              title: `${t.company_name} — Discovery Call`,
              category: "Meeting Notes",
              preview: t.AI_summary,
              tags: [t.industry, t.lead_status.toLowerCase(), "meeting"],
              client: t.company_name,
              edited: new Date(t.meeting_date).toLocaleDateString(),
              status: "active",
              transcriptData: t.transcript
            });
          });
        }

        // Map some activities to Reports / AI Summaries
        if (actRes.activities) {
          actRes.activities.forEach((a: any, i: number) => {
            loadedDocs.push({
              id: a.activity_id,
              title: `${a.activity_type} - ${a.account_name}`,
              category: i % 2 === 0 ? "Reports" : "AI Summaries",
              preview: a.short_description,
              tags: [a.priority.toLowerCase(), "automated"],
              client: a.account_name,
              edited: new Date(a.timestamp).toLocaleDateString(),
              status: "active"
            });
          });
        }

        setDocs(loadedDocs);
        if (loadedDocs.length > 0) {
          const defaultDoc = loadedDocs.find(d => d.category === "Meeting Notes") || loadedDocs[0];
          setActiveDoc(defaultDoc);
          setAiMsgs([{
            role: "ai",
            text: "I've analyzed this document. Key signals detected:",
            cards: [
              { label: "AI Analysis", value: "Ready for querying", color: "#4ade80" },
            ],
          }]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [aiMsgs]);

  if (loading) {
    return (
      <div className="min-h-screen pb-12">
        <div className="page" style={{ paddingTop: 32 }}>
          <div className="animate-pulse flex gap-2 items-center text-gray-500">
            <Zap size={14} color="#4f7bff" /> Loading documents and transcripts...
          </div>
        </div>
      </div>
    );
  }

  const docsInCat = docs.filter(d =>
    d.category === activeCat &&
    (!search || d.title.toLowerCase().includes(search.toLowerCase()) || d.client.toLowerCase().includes(search.toLowerCase()))
  );

  const openDoc = (doc: Doc) => { 
    setActiveDoc(doc); 
    setAiMsgs([{
      role: "ai",
      text: "I've analyzed this document. What would you like to know?",
    }]); 
  };

  const sendAi = (text: string) => {
    if (!text.trim() || !activeDoc) return;
    setAiMsgs(p => [...p, { role: "user", text }]);
    setAiInput(""); setAiTyping(true);
    setTimeout(() => {
      const t = text.toLowerCase();
      let reply: AiMessage;
      if (t.includes("action") || t.includes("task")) {
        reply = { role: "ai", text: "Action items extracted:", cards: [
          { label: "Extracted",    value: "Follow up as outlined in document.",   color: "#4ade80" },
        ]};
      } else if (t.includes("risk") || t.includes("objection")) {
        reply = { role: "ai", text: "Risk signals detected:", cards: [
          { label: "Attention",   value: "Review timeline constraints", color: "#f87171" },
        ]};
      } else if (t.includes("summar")) {
        reply = { role: "ai", text: `Summary of "${activeDoc.title}":\\n\\n${activeDoc.preview}` };
      } else {
        reply = { role: "ai", text: "Based on this document:", cards: [
          { label: "Key Insight", value: "Signal has logged this context", color: "#c4b5fd" },
        ]};
      }
      setAiMsgs(p => [...p, reply]); setAiTyping(false);
    }, 1400);
  };

  const B = "rgba(255,255,255,0.06)";

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0e0e0e", overflow: "hidden" }}>

      {/* ══════════════════════════════════════════
          SUB-SIDEBAR LEVEL 1 — Category tabs
      ══════════════════════════════════════════ */}
      <div style={{
        width: 56, flexShrink: 0,
        borderRight: `1px solid ${B}`,
        background: "#090909",
        display: "flex", flexDirection: "column",
        alignItems: "center", paddingTop: 16, gap: 4,
        zIndex: 10,
      }}>
        {CATEGORIES.map(({ id, label, icon: Icon, color }) => {
          const active = activeCat === id;
          return (
            <button
              key={id}
              title={label}
              onClick={() => { setActiveCat(id); setSearch(""); }}
              style={{
                width: 40, height: 40, borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "none", cursor: "pointer",
                background: active ? `rgba(${color === "#4f7bff" ? "79,123,255" : color === "#a78bfa" ? "167,139,250" : color === "#34d399" ? "52,211,153" : color === "#f59e0b" ? "245,158,11" : "251,113,133"},0.15)` : "transparent",
                boxShadow: active ? glow(color + "55", 12) : "none",
                transition: "all 0.15s",
                position: "relative",
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <Icon size={16} style={{ color: active ? color : "#444" }} />
              {active && (
                <span style={{
                  position: "absolute", right: -1, top: "50%", transform: "translateY(-50%)",
                  width: 2, height: 20, borderRadius: 1,
                  background: color, boxShadow: glow(color, 6),
                }} />
              )}
            </button>
          );
        })}

        <div style={{ flex: 1 }} />

        {/* New doc */}
        <button
          title="New document"
          style={{ width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", border: `1px dashed rgba(255,255,255,0.1)`, cursor: "pointer", background: "transparent", marginBottom: 14, transition: "all 0.15s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(79,123,255,0.4)"; (e.currentTarget as HTMLElement).style.background = "rgba(79,123,255,0.06)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          <Plus size={14} style={{ color: "#444" }} />
        </button>
      </div>

      {/* ══════════════════════════════════════════
          SUB-SIDEBAR LEVEL 2 — Doc list for active category
      ══════════════════════════════════════════ */}
      <div style={{
        width: 230, flexShrink: 0,
        borderRight: `1px solid ${B}`,
        background: "#0b0b0b",
        display: "flex", flexDirection: "column",
        zIndex: 10,
      }}>

        {/* Category header */}
        {(() => {
          const cat = CATEGORIES.find(c => c.id === activeCat)!;
          return (
            <div style={{ padding: "14px 14px 10px", borderBottom: `1px solid ${B}`, flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <cat.icon size={13} style={{ color: cat.color }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: "#d0d0d0" }}>{cat.label}</span>
                <span style={{ fontSize: 10, color: "#333", marginLeft: "auto" }}>{docsInCat.length}</span>
              </div>
              {/* Search within category */}
              <div style={{ position: "relative" }}>
                <Search size={11} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#333", pointerEvents: "none" }} />
                <input
                  placeholder={`Search ${cat.label.toLowerCase()}…`}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.03)", border: `1px solid ${B}`,
                    borderRadius: 6, padding: "6px 8px 6px 26px",
                    fontSize: 11, color: "#c8c8c8", fontFamily: "inherit", outline: "none", boxSizing: "border-box",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = `${cat.color}66`)}
                  onBlur={e  => (e.currentTarget.style.borderColor = B)}
                />
              </div>
            </div>
          );
        })()}

        {/* Doc list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}>
          {docsInCat.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 12px", color: "#333" }}>
              <FileText size={20} style={{ margin: "0 auto 8px", display: "block" }} />
              <p style={{ fontSize: 12 }}>No documents</p>
            </div>
          ) : docsInCat.map(doc => {
            const isActive = activeDoc?.id === doc.id;
            const cat = CATEGORIES.find(c => c.id === activeCat)!;
            return (
              <button
                key={doc.id}
                onClick={() => openDoc(doc)}
                style={{
                  width: "100%", textAlign: "left", border: "none", cursor: "pointer",
                  padding: "10px 10px", borderRadius: 8, marginBottom: 2,
                  background: isActive ? `rgba(${activeCat === "Meeting Notes" ? "79,123,255" : activeCat === "Client Knowledge" ? "167,139,250" : activeCat === "AI Summaries" ? "52,211,153" : activeCat === "Sales Playbooks" ? "245,158,11" : "251,113,133"},0.08)` : "transparent",
                  borderLeft: isActive ? `2px solid ${cat.color}` : "2px solid transparent",
                  transition: "all 0.12s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6, marginBottom: 4 }}>
                  <span style={{
                    fontSize: 12, color: isActive ? "#e8e8e8" : "#888",
                    fontWeight: isActive ? 500 : 400,
                    lineHeight: 1.4,
                    flex: 1,
                  }}>
                    {doc.pinned && <span style={{ color: "#f59e0b", marginRight: 3 }}>★</span>}
                    {doc.title}
                  </span>
                  {doc.status === "draft" && (
                    <span style={{ fontSize: 9, color: "#f59e0b", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 3, padding: "1px 5px", flexShrink: 0, marginTop: 1 }}>
                      draft
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, color: "#444" }}>{doc.client}</span>
                  <span style={{ fontSize: 10, color: "#333" }}>{doc.edited}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MAIN — Document Viewer
      ══════════════════════════════════════════ */}
      {activeDoc ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 1 }}>
          {/* Sticky toolbar */}
          <div style={{
            flexShrink: 0,
            background: "rgba(14,14,14,0.95)", backdropFilter: "blur(12px)",
            borderBottom: `1px solid ${B}`,
            padding: "10px 36px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "#333", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {activeCat}
              </span>
              <ChevronRight size={10} style={{ color: "#2a2a2a" }} />
              <span style={{ fontSize: 13, color: "#888" }}>{activeDoc.title}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: activeDoc.status === "active" ? "#4ade80" : "#f59e0b",
                display: "inline-block",
                boxShadow: `0 0 6px ${activeDoc.status === "active" ? "#4ade80" : "#f59e0b"}`,
              }} />
              <span style={{ fontSize: 11, color: "#444" }}>{activeDoc.edited}</span>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "#333", display: "flex", padding: 4 }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#777")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "#333")}
              ><MoreHorizontal size={14} /></button>
            </div>
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            <div style={{ padding: "36px 52px 64px", maxWidth: 680, margin: "0 auto" }}>
              {/* Title */}
              <h1 style={{ fontSize: 21, fontWeight: 600, color: "#f0f0f0", marginBottom: 10, lineHeight: 1.35, letterSpacing: "-0.02em" }}>
                {activeDoc.title}
              </h1>

              {/* Tags + client */}
              <div style={{ display: "flex", gap: 5, marginBottom: 22, flexWrap: "wrap", alignItems: "center" }}>
                {activeDoc.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: 11, color: "#4f7bff", background: "rgba(79,123,255,0.07)",
                    border: "1px solid rgba(79,123,255,0.18)", borderRadius: 4, padding: "2px 7px",
                    display: "flex", alignItems: "center", gap: 3,
                  }}>
                    <Hash size={8} />{tag}
                  </span>
                ))}
                <span style={{ fontSize: 11, color: "#444", background: "rgba(255,255,255,0.03)", border: `1px solid ${B}`, borderRadius: 4, padding: "2px 7px" }}>
                  {activeDoc.client}
                </span>
              </div>

              {/* AI Summary */}
              <div style={{
                background: "rgba(79,123,255,0.05)", border: "1px solid rgba(79,123,255,0.14)",
                borderRadius: 10, padding: "13px 16px", marginBottom: 26,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7 }}>
                  <Brain size={11} style={{ color: "#4f7bff" }} />
                  <span style={{ fontSize: 10, fontWeight: 500, color: "#4f7bff", textTransform: "uppercase", letterSpacing: "0.07em" }}>AI Summary</span>
                  <span style={{ fontSize: 10, color: "#333", marginLeft: "auto" }}>91% confidence</span>
                </div>
                <p style={{ fontSize: 13, color: "#c0c0c0", lineHeight: 1.8 }}>{activeDoc.preview}</p>
              </div>

              {/* Transcript — only for meeting notes */}
              {activeDoc.transcriptData && (
                <div style={{ marginBottom: 26 }}>
                  <p style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.09em", fontWeight: 500, marginBottom: 14 }}>Transcript</p>
                  {activeDoc.transcriptData.map((e: any, i: number) => (
                    <div key={i} style={{
                      display: "flex", gap: 12, padding: "12px 0",
                      borderBottom: `1px solid ${B}`,
                      borderLeft: "2px solid transparent"
                    }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                        background: "rgba(255,255,255,0.05)",
                        border: `1px solid ${B}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 8, fontWeight: 600, color: "#777",
                      }}>
                        {e.speaker.split(" ").map((w: string) => w[0]).join("").slice(0,2)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 500, color: "#d0d0d0" }}>{e.speaker}</span>
                        </div>
                        <p style={{ fontSize: 13, color: "#666", lineHeight: 1.75 }}>{e.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: 13 }}>
          Select a document to view
        </div>
      )}



    </div>
  );
}
