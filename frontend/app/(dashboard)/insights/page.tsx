"use client";

import React, { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import TopBar from "@/components/layout/TopBar";
import { Zap } from "lucide-react";
import { api } from "@/lib/api";

export default function InsightsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [leadsRes, actRes] = await Promise.all([
          api.signal.leads(),
          api.signal.activities()
        ]);
        
        const allLeads = leadsRes.leads || [];
        // Priority Leads: Active deals with AI score >= 75
        const priorityLeads = allLeads.filter((l: any) => l.ai_score >= 75).sort((a: any, b: any) => b.ai_score - a.ai_score).slice(0, 5);
        
        // At-Risk: Active deals with AI score < 50
        const atRisk = allLeads.filter((l: any) => l.ai_score < 50).sort((a: any, b: any) => a.ai_score - b.ai_score).slice(0, 5);
        
        // Reminders: Activities marked as "Action Required" or "Pending"
        const reminders = actRes.activities?.filter((a: any) => a.status === "Action Required" || a.status === "Pending").slice(0, 5) || [];
        
        // Predicted Closures: Active deals with score > 85
        const closures = allLeads.filter((l: any) => l.ai_score >= 85).sort((a: any, b: any) => b.estimated_value - a.estimated_value).slice(0, 3);
        
        // Strategy Suggestions: Static base for now, can be augmented with real stats
        const strategy = [
          `Focus on the ${priorityLeads[0]?.sector || 'Technology'} sector this week; it shows the highest conversion likelihood based on current pipeline momentum.`,
          `Agent ${priorityLeads[0]?.agent || 'Team Lead'} is driving the most high-intent deals. Consider analyzing their outreach sequence.`,
          `You have ${atRisk.length} deals at risk of stalling. Recommend initiating automated re-engagement sequences for scores below 50.`,
          `Your predictive closure pipeline represents ${formatCurrency(closures.reduce((sum: number, l: any) => sum + l.estimated_value, 0))} in highly probable revenue.`
        ];

        setData({
          priority_leads: priorityLeads,
          at_risk: atRisk,
          reminders,
          predicted_closures: closures,
          strategy_suggestions: strategy
        });
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
        <TopBar title="AI Insights" subtitle="Intelligent alerts, risk analysis, and recommendations" />
        <div className="page" style={{ paddingTop: 32 }}>
          <div className="animate-pulse flex gap-2 items-center text-gray-500">
            <Zap size={14} color="#4f7bff" /> Generating AI insights from pipeline and activity data...
          </div>
        </div>
      </div>
    );
  }

  if (!data) return <div className="page text-red-500">Failed to load insights.</div>;

  return (
    <div className="min-h-screen pb-12">
      <TopBar title="AI Insights" subtitle="Intelligent alerts, risk analysis, and recommendations" />

      <div className="page">

        <div style={{ marginBottom: 32 }}>
          <h1 className="page-title">AI Insights</h1>
          <p className="page-subtitle">Intelligent alerts, risk analysis, and predictive recommendations based on your CSV data.</p>
        </div>

        {/* Priority Targets */}
        <div style={{ marginBottom: 8 }}>
          <p style={{ fontSize: 13, color: "#555", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            Priority Targets
          </p>
          {data.priority_leads.map((lead: any) => (
            <div key={lead.opportunity_id} className="insight-row">
              <div>
                <div className="insight-name">{lead.account}</div>
                <div className="insight-sub">{lead.sector} · {lead.product}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#4ade80' }}>
                  {lead.ai_score}
                </span>
              </div>
            </div>
          ))}
        </div>

        <hr className="section-divider" />

        {/* At-Risk Pipelines */}
        <div style={{ marginBottom: 8 }}>
          <p style={{ fontSize: 13, color: "#555", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            At-Risk Pipelines
          </p>
          {data.at_risk.map((lead: any) => (
            <div key={lead.opportunity_id} className="insight-row">
              <div>
                <div className="insight-name">{lead.account}</div>
                <div style={{ fontSize: 12, color: '#f59e0b', marginTop: 2 }}>{lead.agent} · In stage for {lead.days_in_stage} days</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 14, color: '#e0e0e0', fontWeight: 500 }}>{formatCurrency(lead.estimated_value)}</div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#f87171', marginTop: 4, display: 'inline-block' }}>
                  {lead.ai_score}
                </span>
              </div>
            </div>
          ))}
        </div>

        <hr className="section-divider" />

        {/* Smart Reminders */}
        <div style={{ marginBottom: 8 }}>
          <p style={{ fontSize: 13, color: "#555", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            Smart Reminders
          </p>
          {data.reminders.map((r: any) => (
            <div key={r.activity_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid #1e1e1e', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, color: '#555', marginBottom: 3 }}>{r.account_name}</div>
                <div style={{ fontSize: 14, color: '#e0e0e0' }}>{r.short_description}</div>
              </div>
              <span style={{
                fontSize: 11,
                color:      r.priority === 'High' ? '#ef4444' : '#f59e0b',
                background: r.priority === 'High' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                padding: '2px 8px', borderRadius: 4, flexShrink: 0, marginTop: 2,
              }}>
                {r.priority}
              </span>
            </div>
          ))}
        </div>

        <hr className="section-divider" />

        {/* Predicted Closures */}
        <div style={{ marginBottom: 8 }}>
          <p style={{ fontSize: 13, color: "#555", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            Predicted Closures
          </p>
          {data.predicted_closures.map((c: any) => (
            <div key={c.opportunity_id} className="insight-row">
              <div>
                <div className="insight-name">{c.account}</div>
                <div className="insight-sub">Agent: {c.agent}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 14, color: "#4f7bff", fontWeight: 500 }}>{formatCurrency(c.estimated_value)}</div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{c.ai_score}% probability</div>
              </div>
            </div>
          ))}
        </div>

        <hr className="section-divider" />

        {/* AI Strategy */}
        <div>
          <p style={{ fontSize: 13, color: "#555", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            AI Sales Strategy
          </p>
          {data.strategy_suggestions.map((s: string, i: number) => (
            <div key={i} className="insight-row">
              <p style={{ fontSize: 13, color: "#c8c8c8", lineHeight: 1.7 }}>💡 {s}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
