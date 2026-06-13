"use client";

import React, { useState } from "react";
import { FileText, CheckSquare, AlertTriangle, Heart, Clipboard, Calendar, Brain } from "lucide-react";
import { MeetingSummaryResult } from "@/types";
import { api } from "@/lib/api";
import { toast } from "sonner";
import ExportButton from "@/components/shared/ExportButton";
import TopBar from "@/components/layout/TopBar";
import AITyping from "@/components/shared/AITyping";

const SAMPLE_NOTES = `Call with Sarah from TechFlow Inc - June 12, 2026

Duration: 45 minutes
Participants: Sarah Johnson (VP Sales), John (CTO), myself

Sarah mentioned they currently use spreadsheets + Salesforce but the integration is broken. Their team of 35 sales reps spends 3+ hours daily on manual data entry. They lose visibility into deals after the initial qualification stage.

John is worried about data security and migration timeline. He mentioned their IT audit is in Q3 so any implementation would need to happen before or after.

Sarah really liked the lead scoring demo. She asked if we can integrate with their existing Slack workflows. Budget seems approved - she mentioned "we have $80-100K budgeted for this."

Major concerns:
- Data migration from legacy system
- Team adoption and training timeline
- API access for their internal tools

Next steps discussed:
- Send technical specs to John by Friday
- Schedule a wider demo with their full sales team next week
- Get intro to their CFO for contract discussions`;

export default function MeetingPage() {
  const [notes, setNotes] = useState("");
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [selectedTranscript, setSelectedTranscript] = useState("");
  const [result, setResult] = useState<MeetingSummaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  React.useEffect(() => {
    async function loadTranscripts() {
      try {
        const res = await api.signal.transcripts();
        setTranscripts(res.transcripts || []);
      } catch (e) {
        console.error(e);
      }
    }
    loadTranscripts();
  }, []);

  const handleTranscriptSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedTranscript(id);
    
    if (!id) {
      setNotes("");
      setResult(null);
      return;
    }

    const t = transcripts.find(x => x.meeting_id === id);
    if (t) {
      // Format the raw transcript
      let rawText = `Meeting ID: ${t.meeting_id}\nCompany: ${t.company_name} (Client: ${t.client_name})\nRep: ${t.sales_rep}\nIndustry: ${t.industry}\nDate: ${t.meeting_date}\n\n--- Transcript ---\n\n`;
      t.transcript.forEach((line: any) => {
        rawText += `${line.speaker}: ${line.text}\n\n`;
      });
      setNotes(rawText.trim());
      setResult(null);
    }
  };

  const handleSummarize = async () => {
    if (!notes.trim()) {
      toast.error("Please enter raw call notes to summarize.");
      return;
    }
    setLoading(true);
    setResult(null);
    setIsTyping(false);
    try {
      const data = (await api.ai.summarizeMeeting(notes)) as MeetingSummaryResult;
      setResult(data);
      setIsTyping(true);
      toast.success("Meeting call notes summarized.");
    } catch {
      toast.error("Backend offline — loading demo result.");
    } finally {
      setLoading(false);
    }
  };

  const useSample = () => {
    setNotes(SAMPLE_NOTES);
    toast.info("Sample call notes loaded.");
  };

  const sections = result ? [
    { title: "Key Requirements",  items: result.key_requirements, icon: <CheckSquare size={13} /> },
    { title: "Objections Raised", items: result.objections,       icon: <AlertTriangle size={13} /> },
    { title: "Client Pain Points",items: result.pain_points,      icon: <Heart size={13} /> },
    { title: "Action Items",      items: result.action_items,     icon: <Clipboard size={13} /> },
    { title: "Follow-Up Agenda",  items: result.follow_up_tasks,  icon: <Calendar size={13} /> },
  ] : [];

  return (
    <div className="min-h-screen pb-12">
      <TopBar title="Meeting Summarizer" subtitle="Extract structured action items from call notes." />

      <div className="page">

        <div style={{ marginBottom: 32 }}>
          <h1 className="page-title">Meeting Summarizer</h1>
          <p className="page-subtitle">Paste raw call notes — AI extracts requirements, objections, and action items.</p>
        </div>

        {/* Input area */}
        <div style={{ maxWidth: 640 }}>
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "12px", color: "#555", display: "block", marginBottom: "6px" }}>Select Meeting Transcript</label>
            <select
              value={selectedTranscript}
              onChange={handleTranscriptSelect}
              style={{
                width: "100%", background: "#111118",
                border: "1px solid #2a2a2a", borderRadius: "8px",
                padding: "12px 14px", fontSize: "13px",
                color: "#c8c8c8", outline: "none",
                boxSizing: "border-box"
              }}
            >
              <option value="">-- Custom Notes --</option>
              {transcripts.map(t => (
                <option key={t.meeting_id} value={t.meeting_id}>
                  {t.meeting_date.split('T')[0]} - {t.company_name} ({t.client_name}) - Rep: {t.sales_rep}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <label style={{ fontSize: '12px', color: '#555', marginBottom: '8px', display: 'block' }}>Call Transcript Notes</label>
            <button
              onClick={useSample}
              style={{ background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '7px', padding: '6px 14px', fontSize: '12px', color: '#666', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Load Sample
            </button>
          </div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Paste raw sales transcripts, voice-to-text outputs, or post-meeting bullet notes here..."
            style={{ width: '100%', background: '#111118', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '14px 16px', fontSize: '13px', fontFamily: 'Inter, system-ui, sans-serif', color: '#c8c8c8', resize: 'vertical', outline: 'none', minHeight: '220px', boxSizing: 'border-box', lineHeight: 1.7 }}
          />
          <span style={{ fontSize: '12px', color: '#444', marginTop: '6px', display: 'block' }}>{notes.length} characters</span>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {result && <ExportButton data={result} filename="meeting-summary" label="Export" />}
            </div>
            <button
              onClick={handleSummarize}
              disabled={loading}
              style={{ background: '#4f7bff', border: 'none', borderRadius: '7px', padding: '10px 20px', fontSize: '13px', fontWeight: 500, color: 'white', cursor: 'pointer', fontFamily: 'inherit', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {loading ? (
                <>
                  <div style={{ width: 12, height: 12, border: "1.5px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  Processing...
                </>
              ) : (
                <><Brain size={13} /> Summarize notes</>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <>
            <hr className="section-divider" />

            {/* Executive Summary */}
            <div style={{ maxWidth: 720, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: "#555", marginBottom: 10, fontWeight: 500 }}>Executive Summary</p>
              <p style={{ fontSize: 14, color: "#c8c8c8", lineHeight: 1.8 }}>
                {isTyping ? (
                  <AITyping text={result.summary} speed={8} onComplete={() => setIsTyping(false)} />
                ) : (
                  result.summary
                )}
              </p>
            </div>

            <hr className="section-divider" />

            {/* Categorized points */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, maxWidth: 720 }}>
              {sections.map(({ title, items, icon }) => (
                <div key={title}>
                  <p style={{ fontSize: 13, color: "#555", fontWeight: 500, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    {icon} {title}
                  </p>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {items.map((item, i) => (
                      <li key={i} style={{ fontSize: 13, color: "#c8c8c8", lineHeight: 1.7, paddingBottom: 6, borderBottom: "1px solid #1e1e1e", marginBottom: 6 }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {result.next_meeting_suggestion && (
              <>
                <hr className="section-divider" />
                <div style={{ maxWidth: 720 }}>
                  <p style={{ fontSize: 13, color: "#555", fontWeight: 500, marginBottom: 8 }}>Next Meeting Target</p>
                  <p style={{ fontSize: 14, color: "#c8c8c8", lineHeight: 1.7 }}>{result.next_meeting_suggestion}</p>
                </div>
              </>
            )}
          </>
        )}

      </div>
    </div>
  );
}
