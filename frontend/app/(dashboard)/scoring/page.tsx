"use client";

import React, { useState, useEffect } from "react";
import { Zap, Brain, Target, TrendingUp, Search, ChevronDown } from "lucide-react";
import ScoreRing from "@/components/shared/ScoreRing";
import { LeadScoringResult } from "@/types";
import { api } from "@/lib/api";
import { toast } from "sonner";
import ExportButton from "@/components/shared/ExportButton";
import TopBar from "@/components/layout/TopBar";
import AITyping from "@/components/shared/AITyping";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ScoringPage() {
  const [activeLeads, setActiveLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<string>("");

  const [clientNotes, setClientNotes] = useState("");
  const [meetingSummary, setMeetingSummary] = useState("");
  const [interactionHistory, setInteractionHistory] = useState("");
  
  const [result, setResult] = useState<LeadScoringResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadLeads() {
      try {
        const res = await api.signal.leads();
        setActiveLeads(res.leads);
      } catch (e) {
        console.error(e);
      }
    }
    loadLeads();
  }, []);

  const handleLeadSelect = (e: any) => {
    const oppId = e.target.value;
    setSelectedLead(oppId);
    
    if (!oppId) {
      setClientNotes("");
      setMeetingSummary("");
      setInteractionHistory("");
      setResult(null);
      return;
    }

    const lead = activeLeads.find(l => l.opportunity_id === oppId);
    if (lead) {
      setClientNotes(`Company: ${lead.account}\nSector: ${lead.sector}\nProduct Interest: ${lead.product} (${formatCurrency(lead.estimated_value)})\nAgent Assigned: ${lead.agent}`);
      setInteractionHistory(`Deal has been in the "${lead.stage}" stage for ${lead.days_in_stage} days. AI Baseline Score is ${lead.ai_score}/100.`);
      setMeetingSummary(`Recent interactions have been positive. Need to evaluate urgency and buying intent based on ${lead.sector} industry benchmarks.`);
      setResult(null);
    }
  };

  const handleScore = async () => {
    if (!clientNotes.trim()) {
      toast.error("Please enter client notes to initiate AI analysis.");
      return;
    }
    setLoading(true);
    setResult(null);
    setIsTyping(false);
    try {
      const data = (await api.ai.scoreLead({
        client_notes: clientNotes,
        meeting_summary: meetingSummary,
        interaction_history: interactionHistory,
      })) as LeadScoringResult;
      setResult(data);
      setIsTyping(true);
      toast.success("Lead scoring calculations complete.");
    } catch {
      toast.error("Failed to connect to AI engine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 48 }}>
      <TopBar title="Lead Scoring" subtitle="Leverage LLaMA 3.3 70B models for intent rating." />

      <div className="page">

        <div style={{ marginBottom: 32 }}>
          <h1 className="page-title">AI Lead Scoring</h1>
          <p className="page-subtitle">Multi-signal AI evaluation — buying intent, urgency, sentiment, engagement.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "60% 40%", gap: 48, alignItems: "start" }}>

          {/* ── Left: Form ── */}
          <div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontSize: "12px", color: "#555", display: "block", marginBottom: "6px" }}>Select Pipeline Deal (Optional)</label>
              <div style={{ position: "relative" }}>
                <div 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    width: "100%", background: "#111118",
                    border: "1px solid #2a2a2a", borderRadius: "8px",
                    padding: "12px 14px", fontSize: "13px",
                    color: "#c8c8c8", outline: "none",
                    boxSizing: "border-box", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}
                >
                  <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: 12 }}>
                    {selectedLead && activeLeads.find(l => l.opportunity_id === selectedLead) 
                      ? `${activeLeads.find(l => l.opportunity_id === selectedLead)?.account} - ${activeLeads.find(l => l.opportunity_id === selectedLead)?.product}`
                      : "-- Custom Lead --"}
                  </span>
                  <ChevronDown size={14} color="#555" style={{ flexShrink: 0 }} />
                </div>
                
                {dropdownOpen && (
                  <div style={{
                    position: "absolute", top: "100%", left: 0, right: 0, marginTop: 6,
                    background: "#111118", border: "1px solid #2a2a2a", borderRadius: 8,
                    zIndex: 100, maxHeight: 280, overflowY: "auto",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
                  }}>
                    <div style={{ padding: "8px", borderBottom: "1px solid #2a2a2a", position: "sticky", top: 0, background: "#111118" }}>
                      <input 
                        autoFocus
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search companies..."
                        style={{
                          width: "100%", padding: "8px 10px", background: "#1a1a24",
                          border: "1px solid #333", borderRadius: 6, color: "#fff",
                          outline: "none", fontSize: 13
                        }}
                      />
                    </div>
                    
                    <div 
                      onClick={() => { handleLeadSelect({ target: { value: "" }}); setDropdownOpen(false); }}
                      style={{ padding: "10px 14px", cursor: "pointer", fontSize: 13, color: selectedLead === "" ? "#7c5cfc" : "#c8c8c8" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      -- Custom Lead --
                    </div>
                    
                    {activeLeads.filter(l => l.account.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 50).map(l => (
                      <div
                        key={l.opportunity_id}
                        onClick={() => { handleLeadSelect({ target: { value: l.opportunity_id }}); setDropdownOpen(false); setSearchTerm(""); }}
                        style={{
                          padding: "10px 14px", cursor: "pointer", fontSize: 13,
                          color: selectedLead === l.opportunity_id ? "#7c5cfc" : "#c8c8c8",
                          borderTop: "1px solid rgba(255,255,255,0.05)"
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <div style={{ fontWeight: 500, color: selectedLead === l.opportunity_id ? "#7c5cfc" : "#e0e0e0", marginBottom: 2 }}>
                          {l.account}
                        </div>
                        <div style={{ fontSize: 11, color: "#666" }}>
                          {l.product} ({formatCurrency(l.estimated_value)})
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Field helper */}
            {[
              { label: "Client Notes & Background *", value: clientNotes,          setter: setClientNotes,          ph: "Enter details about lead interactions, inquiries, goals, budget statements..." },
              { label: "Meeting Context",              value: meetingSummary,       setter: setMeetingSummary,       ph: "Summary of latest demo, call takeaways, or checklist items..."               },
              { label: "Historical Interactions",      value: interactionHistory,   setter: setInteractionHistory,   ph: "Touchpoint details, email campaign stats, or trial activities..."             },
            ].map(({ label, value, setter, ph }) => (
              <div key={label}>
                <label style={{ fontSize: "12px", color: "#555", display: "block", marginBottom: "6px" }}>{label}</label>
                <textarea
                  value={value}
                  onChange={e => setter(e.target.value)}
                  placeholder={ph}
                  style={{
                    width: "100%", background: "#111118",
                    border: "1px solid #2a2a2a", borderRadius: "8px",
                    padding: "12px 14px", fontSize: "13px",
                    fontFamily: "Inter, system-ui, sans-serif",
                    color: "#c8c8c8", resize: "vertical",
                    outline: "none", minHeight: "100px",
                    boxSizing: "border-box", lineHeight: 1.7,
                    marginBottom: "16px", display: "block",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = "#7c5cfc";
                    e.currentTarget.style.boxShadow  = "0 0 0 3px rgba(124,92,252,0.1)";
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = "#2a2a2a";
                    e.currentTarget.style.boxShadow  = "none";
                  }}
                />
              </div>
            ))}

            <button
              onClick={handleScore}
              disabled={loading}
              style={{
                width: "100%", background: "#7c5cfc", border: "none",
                borderRadius: "8px", padding: "12px", fontSize: "14px",
                fontWeight: 500, color: "white", cursor: "pointer",
                fontFamily: "inherit", display: "flex",
                alignItems: "center", justifyContent: "center", gap: "8px",
                opacity: loading ? 0.75 : 1, transition: "opacity 0.15s",
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: 12, height: 12, border: "1.5px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%" }} />
                  Analyzing with LLaMA 3.3...
                </>
              ) : (
                <>⚡ Analyze &amp; Score Lead</>
              )}
            </button>
          </div>

          {/* ── Right: Result panel ── */}
          <div>
            {result ? (
              <>
                {/* Score circle */}
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  border: "3px solid #7c5cfc",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, fontWeight: 600, color: "white",
                  margin: "0 auto 24px",
                }}>
                  {result.score}
                </div>

                {/* Classification badge */}
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <span style={{
                    fontSize: 12, padding: "3px 10px", borderRadius: 4,
                    border: "1px solid #2a2a2a",
                    color: result.classification === "Hot Lead" ? "#f87171" : result.classification === "Warm Lead" ? "#fbbf24" : "#818cf8",
                    background: result.classification === "Hot Lead" ? "rgba(239,68,68,0.08)" : result.classification === "Warm Lead" ? "rgba(245,158,11,0.08)" : "rgba(99,102,241,0.08)",
                  }}>
                    {result.classification === "Hot Lead" ? "🔥" : result.classification === "Warm Lead" ? "⚡" : "❄️"} {result.classification}
                  </span>
                </div>

                {/* Four signal rows */}
                <div style={{ marginBottom: 24 }}>
                  {[
                    { label: "Buying Intent", value: result.buying_intent },
                    { label: "Urgency",        value: result.urgency       },
                    { label: "Sentiment",      value: result.sentiment     },
                    { label: "Engagement",     value: result.engagement    },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1e1e1e" }}>
                      <span style={{ fontSize: 13, color: "#555" }}>{label}</span>
                      <span style={{ fontSize: 13, color: value >= 70 ? "#4ade80" : value >= 40 ? "#fbbf24" : "#f87171", fontWeight: 500 }}>
                        {value}%
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="section-divider" />

                {/* Reasoning */}
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 11, color: "#444", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>AI Reasoning</p>
                  <p style={{ fontSize: 13, color: "#c8c8c8", lineHeight: 1.8 }}>
                    {isTyping ? (
                      <AITyping text={result.reasoning} speed={10} onComplete={() => setIsTyping(false)} />
                    ) : (
                      result.reasoning
                    )}
                  </p>
                </div>

                <hr className="section-divider" />

                {/* Next action */}
                <div>
                  <p style={{ fontSize: 11, color: "#444", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Recommended Next Action</p>
                  <p style={{ fontSize: 13, color: "#c8c8c8", lineHeight: 1.8 }}>{result.next_action}</p>
                </div>

                <div style={{ marginTop: 20 }}>
                  <ExportButton data={result} filename="lead-score" label="Export" />
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "48px 20px", color: "#444" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>⚡</div>
                <div style={{ fontSize: 15, color: "#777", marginBottom: 8 }}>Ready to score</div>
                <div style={{ fontSize: 13, color: "#444", lineHeight: 1.6 }}>
                  Select a pipeline deal or fill in the context manually to trigger multi-signal AI evaluation.
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
