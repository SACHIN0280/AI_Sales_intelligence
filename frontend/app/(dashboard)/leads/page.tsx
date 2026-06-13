"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, Zap } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import { api } from "@/lib/api";

function compactValue(v: number): string {
  if (v >= 1000) return `$${Math.round(v / 1000)}k`;
  return `$${v}`;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.signal.leads();
        // Sort by AI Score descending
        const sortedLeads = res.leads.sort((a: any, b: any) => b.ai_score - a.ai_score);
        setLeads(sortedLeads);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pb-12">
        <TopBar title="Pipeline" />
        <div className="page" style={{ paddingTop: 32 }}>
          <div className="animate-pulse flex gap-2 items-center text-gray-500">
            <Zap size={14} color="#4f7bff" /> Syncing pipeline data from CSV engine...
          </div>
        </div>
      </div>
    );
  }

  const pipeline = leads.reduce((s, l) => s + (l.estimated_value || 0), 0);
  // Calculate a true weighted AI forecast based on each deal's AI score probability
  const aiForecast = leads.reduce((s, l) => s + ((l.estimated_value || 0) * (l.ai_score || 0) / 100), 0);
  const committed = pipeline;

  return (
    <div className="min-h-screen pb-12">
      <TopBar title="Pipeline" subtitle="Active engaging and prospecting deals" />

      <div className="page" style={{ paddingTop: 32 }}>

        {/* ── Page header ── */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 28 }}>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: "#f0f0f0" }}>Active Pipeline</h1>
            <div>
              <div style={{ fontSize: 12, color: "#555", marginBottom: 2 }}>AI Forecast (Score Weighted)</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: "#4f7bff" }}>{compactValue(Math.round(aiForecast))}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#555", marginBottom: 2 }}>Total Pipeline Value ({leads.length} Deals)</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: "#f0f0f0" }}>{compactValue(committed)}</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: "#555" }}>
            {leads.length} active deals
          </div>
        </div>

        {/* ── Table ── */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #222" }}>
              <th style={{ textAlign: "left", fontSize: 13, fontWeight: 400, color: "#555", padding: "8px 16px 8px 0" }}>Company</th>
              <th style={{ textAlign: "left", fontSize: 13, fontWeight: 400, color: "#555", padding: "8px 24px 8px 0" }}>Agent</th>
              <th style={{ textAlign: "left", fontSize: 13, fontWeight: 400, color: "#555", padding: "8px 24px 8px 0" }}>Product</th>
              <th style={{ textAlign: "left", fontSize: 13, fontWeight: 400, color: "#555", padding: "8px 24px 8px 0" }}>Stage</th>
              <th style={{ textAlign: "left", fontSize: 13, fontWeight: 400, color: "#555", padding: "8px 24px 8px 0" }}>Value</th>
              <th style={{ textAlign: "left", fontSize: 13, fontWeight: 400, color: "#555", padding: "8px 16px 8px 0" }}>Age (Days)</th>
              <th style={{ textAlign: "right", fontSize: 13, fontWeight: 400, color: "#555", padding: "8px 0" }}>AI Score</th>
            </tr>
          </thead>
          <tbody>
            {leads.slice(0, 100).map((lead) => { // Render top 100 to avoid lag
              return (
                <tr
                  key={lead.opportunity_id}
                  style={{ borderBottom: "1px solid #1a1a1a" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.012)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  {/* Account */}
                  <td style={{ padding: "16px 16px 16px 0", verticalAlign: "top" }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#e8e8e8" }}>{lead.account}</div>
                    <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{lead.sector}</div>
                  </td>

                  {/* Agent */}
                  <td style={{ padding: "16px 24px 16px 0", verticalAlign: "top", fontSize: 14, color: "#d0d0d0" }}>
                    {lead.agent}
                  </td>

                  {/* Product */}
                  <td style={{ padding: "16px 24px 16px 0", verticalAlign: "top", fontSize: 14, color: "#888" }}>
                    {lead.product}
                  </td>

                  {/* Stage */}
                  <td style={{ padding: "16px 24px 16px 0", verticalAlign: "top" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, color: lead.stage === "Engaging" ? "#4f7bff" : "#888", fontSize: 14 }}>
                      {lead.stage}
                    </div>
                  </td>

                  {/* Value */}
                  <td style={{ padding: "16px 24px 16px 0", verticalAlign: "top", fontSize: 14, color: "#d0d0d0" }}>
                    {compactValue(lead.estimated_value)}
                  </td>

                  {/* Age */}
                  <td style={{ padding: "16px 16px 16px 0", verticalAlign: "top", fontSize: 13, color: "#555", whiteSpace: "nowrap" }}>
                    {lead.days_in_stage}d
                  </td>

                  {/* AI Score */}
                  <td style={{ padding: "16px 0", verticalAlign: "top", textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: lead.ai_score >= 75 ? "#4ade80" : lead.ai_score >= 50 ? "#f59e0b" : "#f87171" }}>
                        {lead.ai_score}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{lead.status}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {leads.length > 100 && (
          <div style={{ padding: "16px 0", textAlign: "center", fontSize: 13, color: "#555" }}>
            Showing top 100 of {leads.length} active deals
          </div>
        )}
      </div>
    </div>
  );
}
