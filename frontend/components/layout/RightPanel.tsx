"use client";

import React from "react";
import { Target, TrendingUp, Bell, Zap, Brain, ChevronRight, Clock } from "lucide-react";

const priorityLeads = [
  { name: "Noah Williams", company: "Stripe", score: 94, trend: "+8", status: "Hot Lead" },
  { name: "Emma Watson",   company: "GitHub", score: 88, trend: "+5", status: "Warm Lead" },
  { name: "Liam Chen",     company: "Figma",  score: 81, trend: "+3", status: "Warm Lead" },
];

const reminders = [
  { lead: "Noah Williams", action: "Follow-up call due", time: "In 2 hours", urgent: true },
  { lead: "Emma Watson",   action: "Send contract draft", time: "Tomorrow 9AM", urgent: false },
  { lead: "Stripe Deal",   action: "Demo scheduled", time: "Thu 2PM", urgent: false },
];

const insights = [
  { text: "Pipeline velocity up 18% WoW", color: "text-emerald-DEFAULT" },
  { text: "3 deals at risk of going cold", color: "text-amber-DEFAULT" },
  { text: "Email open rate peaked today", color: "text-blue-light" },
];

function ScoreRing({ score }: { score: number }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" className="flex-shrink-0">
      <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
      <circle
        cx="22" cy="22" r={r} fill="none"
        stroke={color} strokeWidth="3"
        strokeDasharray={circ}
        strokeDashoffset={circ - fill}
        strokeLinecap="round"
        transform="rotate(-90 22 22)"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
      <text x="22" y="27" textAnchor="middle" fontSize="9" fontWeight="700" fill={color} fontFamily="JetBrains Mono">{score}</text>
    </svg>
  );
}

export default function RightPanel() {
  return (
    <aside
      className="w-72 h-screen fixed right-0 top-0 z-30 flex flex-col overflow-y-auto border-l border-white/[0.06]"
      style={{
        background: "linear-gradient(180deg, #08081a 0%, #060612 100%)",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-DEFAULT/30 to-transparent" />

      {/* ── Header ── */}
      <div className="px-4 py-5 border-b border-white/[0.05] flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)", boxShadow: "0 0 12px rgba(139,92,246,0.4)" }}>
          <Brain className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-heading font-semibold text-sm text-white">AI Insights</span>
        <span className="ml-auto text-[9px] font-mono text-cyan-DEFAULT uppercase tracking-widest">Live</span>
      </div>

      {/* ── Pipeline Summary ── */}
      <div className="p-4">
        <div
          className="rounded-xl p-4"
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.06))",
            border: "1px solid rgba(59,130,246,0.15)",
          }}
        >
          <div className="text-[10px] text-text-muted font-mono uppercase tracking-widest mb-3">Pipeline Health</div>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-2xl font-heading font-bold text-white">$1.24M</span>
            <span className="text-xs text-emerald-DEFAULT font-mono mb-0.5">+18% ↑</span>
          </div>
          {/* Bar */}
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-2">
            <div
              className="h-full rounded-full"
              style={{
                width: "68%",
                background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
                boxShadow: "0 0 8px rgba(59,130,246,0.5)",
              }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-text-muted font-mono">
            <span>68% to quota</span>
            <span>24 active deals</span>
          </div>
        </div>
      </div>

      {/* ── Conversion Probability ── */}
      <div className="px-4 pb-4">
        <div className="text-[10px] text-text-muted font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
          <TrendingUp className="w-3 h-3" /> AI Conversion Probability
        </div>
        <div className="space-y-2">
          {[
            { label: "Email channel", pct: 72, color: "#3b82f6" },
            { label: "LinkedIn",      pct: 54, color: "#8b5cf6" },
            { label: "Cold outreach", pct: 31, color: "#06b6d4" },
          ].map(({ label, pct, color }) => (
            <div key={label}>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-text-secondary">{label}</span>
                <span className="font-mono" style={{ color }}>{pct}%</span>
              </div>
              <div className="h-1 rounded-full bg-white/[0.05]">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}60` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Priority Leads ── */}
      <div className="px-4 pb-4">
        <div className="text-[10px] text-text-muted font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
          <Target className="w-3 h-3" /> Priority Targets
        </div>
        <div className="space-y-2">
          {priorityLeads.map((lead) => (
            <div
              key={lead.name}
              className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/[0.04]"
              style={{ border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <ScoreRing score={lead.score} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-white truncate">{lead.name}</div>
                <div className="text-[10px] text-text-muted">{lead.company}</div>
                <div className="text-[9px] font-mono text-emerald-DEFAULT mt-0.5">{lead.trend} pts this week</div>
              </div>
              <ChevronRight className="w-3 h-3 text-text-dim flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Smart Reminders ── */}
      <div className="px-4 pb-4">
        <div className="text-[10px] text-text-muted font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
          <Bell className="w-3 h-3" /> Smart Reminders
        </div>
        <div className="space-y-2">
          {reminders.map((r, i) => (
            <div
              key={i}
              className="p-2.5 rounded-xl"
              style={{
                background: r.urgent ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.02)",
                border: r.urgent ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: r.urgent ? "#ef4444" : "#f59e0b", boxShadow: r.urgent ? "0 0 6px rgba(239,68,68,0.8)" : "0 0 6px rgba(245,158,11,0.8)" }}
                />
                <span className="text-[10px] font-medium text-text-secondary truncate">{r.lead}</span>
              </div>
              <div className="text-[10px] text-text-muted">{r.action}</div>
              <div className="text-[9px] font-mono text-text-dim flex items-center gap-1 mt-1">
                <Clock className="w-2.5 h-2.5" /> {r.time}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI Insights Feed ── */}
      <div className="px-4 pb-6">
        <div className="text-[10px] text-text-muted font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
          <Zap className="w-3 h-3" /> AI Feed
        </div>
        <div className="space-y-2">
          {insights.map((ins, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 p-2.5 rounded-lg"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
            >
              <Zap className={`w-3 h-3 flex-shrink-0 mt-0.5 ${ins.color}`} />
              <span className="text-[10px] text-text-secondary leading-relaxed">{ins.text}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
