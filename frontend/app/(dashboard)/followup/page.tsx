"use client";

import React, { useState } from "react";
import { MessageSquare, Copy, Check, Mail, Link2, Phone, Send, Bot, Sparkles } from "lucide-react";
import { FollowUpResult } from "@/types";
import { api } from "@/lib/api";
import { toast } from "sonner";
import TopBar from "@/components/layout/TopBar";
import AITyping from "@/components/shared/AITyping";

const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "friendly",     label: "Friendly"     },
  { value: "persuasive",   label: "Persuasive"   },
  { value: "concise",      label: "Concise"      },
];
const TYPE_OPTIONS = [
  { value: "email",         label: "Email",    icon: <Mail  size={12} /> },
  { value: "linkedin",      label: "LinkedIn", icon: <Link2 size={12} /> },
  { value: "whatsapp",      label: "WhatsApp", icon: <Phone size={12} /> },
  { value: "cold_outreach", label: "Outbound", icon: <Send  size={12} /> },
];

export default function FollowUpPage() {
  const [context,  setContext]  = useState("");
  const [leadName, setLeadName] = useState("");
  const [company,  setCompany]  = useState("");
  const [tone,     setTone]     = useState("professional");
  const [msgType,  setMsgType]  = useState("email");
  const [result,   setResult]   = useState<FollowUpResult | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [copied,   setCopied]   = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleGenerate = async () => {
    if (!context.trim() || !leadName.trim()) {
      toast.error("Lead name and context required.");
      return;
    }
    setLoading(true); setResult(null); setIsTyping(false);
    try {
      const data = (await api.ai.generateFollowup({ context, lead_name: leadName, company, tone, type: msgType })) as FollowUpResult;
      setResult(data); setIsTyping(true);
      toast.success("AI draft generated!");
    } catch {
      toast.error("Demo mode — showing sample output.");
    } finally { setLoading(false); }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = result.subject ? `Subject: ${result.subject}\n\n${result.message}` : result.message;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pb-12">
      <TopBar title="Follow-Up Generator" subtitle="Generate personalized outreach messages instantly" />

      <div className="page">

        <div style={{ marginBottom: 32 }}>
          <h1 className="page-title">Follow-Up Generator</h1>
          <p className="page-subtitle">AI-generated personalized outreach for every channel.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 48 }}>

          {/* ── Left: Form ── */}
          <div style={{ maxWidth: 560 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: '12px', color: '#555', marginBottom: '6px', display: 'block' }}>Lead Name *</label>
                <input
                  value={leadName}
                  onChange={e => setLeadName(e.target.value)}
                  placeholder="Sarah Johnson"
                  style={{ width: '100%', background: '#111118', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', fontFamily: 'Inter, system-ui, sans-serif', color: '#d0d0d0', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#555', marginBottom: '6px', display: 'block' }}>Company</label>
                <input
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="TechFlow Inc"
                  style={{ width: '100%', background: '#111118', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', fontFamily: 'Inter, system-ui, sans-serif', color: '#d0d0d0', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '12px', color: '#555', marginBottom: '6px', display: 'block' }}>Outreach Context *</label>
              <textarea
                value={context}
                onChange={e => setContext(e.target.value)}
                rows={5}
                placeholder="Describe your last meeting, pain points, or specific goals..."
                style={{ width: '100%', background: '#111118', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', fontFamily: 'Inter, system-ui, sans-serif', color: '#d0d0d0', outline: 'none', boxSizing: 'border-box', minHeight: '100px', resize: 'vertical' }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '12px', color: '#555', marginBottom: '6px', display: 'block' }}>Channel</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {TYPE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setMsgType(opt.value)}
                    style={{ background: msgType === opt.value ? 'rgba(79,123,255,0.08)' : 'transparent', border: msgType === opt.value ? '1px solid #4f7bff' : '1px solid #272727', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: msgType === opt.value ? '#4f7bff' : '#666', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: '12px', color: '#555', marginBottom: '6px', display: 'block' }}>Tone</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {TONE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setTone(opt.value)}
                    style={{ background: tone === opt.value ? 'rgba(79,123,255,0.08)' : 'transparent', border: tone === opt.value ? '1px solid #4f7bff' : '1px solid #272727', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: tone === opt.value ? '#4f7bff' : '#666', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              style={{ background: '#4f7bff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 500, color: 'white', cursor: 'pointer', fontFamily: 'inherit', width: '100%', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {loading ? (
                <>
                  <div style={{ width: 12, height: 12, border: "1.5px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%" }} />
                  Generating...
                </>
              ) : (
                <><Bot size={13} /> Generate with AI</>
              )}
            </button>
          </div>

          {/* ── Right: Output ── */}
          <div>
            {result ? (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <p style={{ fontSize: 13, color: "#555", fontWeight: 500 }}>AI Generated Draft</p>
                  <button onClick={handleCopy} className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                    {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                  </button>
                </div>

                {result.subject && (
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: '12px', color: '#555', marginBottom: '6px', display: 'block' }}>Subject Line</label>
                    <p style={{ fontSize: 14, color: "#e0e0e0", fontWeight: 500 }}>{result.subject}</p>
                  </div>
                )}

                <div style={{ fontSize: 14, color: "#c8c8c8", lineHeight: 1.9, whiteSpace: "pre-line" }}>
                  {isTyping ? (
                    <AITyping text={result.message} speed={12} onComplete={() => setIsTyping(false)} />
                  ) : (
                    result.message
                  )}
                </div>

                <div style={{ display: "flex", gap: 6, marginTop: 20 }}>
                  {[result.type, result.tone].map(tag => (
                    <span key={tag} style={{ fontSize: 11, color: "#555", border: "1px solid #2a2a2a", borderRadius: 4, padding: "2px 8px" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '48px 20px', color: '#444' }}>
                <div style={{ marginBottom: 12, color: '#444' }}><Sparkles size={28} /></div>
                <div style={{ fontSize: 15, color: '#777', marginBottom: 8 }}>Ready to generate</div>
                <div style={{ fontSize: 13, color: '#444', lineHeight: 1.6 }}>Fill in the lead details and click Generate.</div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
