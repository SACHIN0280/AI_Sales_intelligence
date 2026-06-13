"use client";

import React, { useEffect, useState } from "react";
import {
  Users, DollarSign, TrendingUp, Zap, Sparkles
} from "lucide-react";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import { api } from "@/lib/api";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid
} from "recharts";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function KPICard({
  label, value, suffix = "", prefix = "", highlight = false
}: {
  label: string; value: number | string; suffix?: string; prefix?: string; highlight?: boolean;
}) {
  return (
    <div>
      <div style={{
        fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 4,
        color: highlight ? "#4f7bff" : "#f0f0f0",
      }}>
        {prefix}{typeof value === "number" ? value.toLocaleString() : value}{suffix}
      </div>
      <div style={{ fontSize: 12, color: "#555" }}>{label}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashRes, leadsRes, actRes] = await Promise.all([
          api.signal.dashboard(),
          api.signal.leads(),
          api.signal.activities()
        ]);
        setData(dashRes);
        setLeads(leadsRes.leads.sort((a: any, b: any) => b.ai_score - a.ai_score).slice(0, 5));
        setActivities(actRes.activities?.slice(0, 6) || []);
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
        <TopBar title="Dashboard" subtitle="Pipeline overview and AI intelligence feed" />
        <div className="page" style={{ color: "#555", paddingTop: 40 }}>
          <div className="animate-pulse flex gap-2 items-center">
            <Zap size={14} color="#4f7bff" /> Syncing pipeline data from CSV engine...
          </div>
        </div>
      </div>
    );
  }

  if (!data) return <div className="page text-red-500">Failed to load data</div>;

  const kpis = [
    { label: "Total Won Revenue", value: Math.round(data.kpis.total_revenue), prefix: "$", highlight: true },
    { label: "Global Win Rate", value: data.kpis.win_rate.toFixed(1), suffix: "%" },
    { label: "Active Deals", value: data.kpis.active_deals },
    { label: "Avg Deal Size", value: Math.round(data.kpis.avg_deal_size), prefix: "$" },
  ];

  return (
    <div className="min-h-screen pb-12">
      <TopBar title="Dashboard" subtitle="Pipeline overview and AI intelligence feed" />

      <div className="page">

        {/* ── AI Morning Brief ── */}
        <div style={{ padding: 0, marginBottom: 28 }}>
          <p style={{ fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>AI Morning Brief</p>
          <p style={{ fontSize: 15, color: "#d0d0d0", maxWidth: 640, lineHeight: 1.7 }}>
            Good morning. Your pipeline has <span style={{ color: "#4f7bff" }}>{data.kpis.active_deals}</span> active deals.
            The current global win rate is <span style={{ color: "#e0e0e0", fontWeight: 500 }}>{data.kpis.win_rate.toFixed(1)}%</span>.
            {data.top_agents.length > 0 && ` ${data.top_agents[0].agent} is leading the team with ${formatCurrency(data.top_agents[0].revenue)} in won revenue.`}
          </p>
          <Link href="/copilot" style={{ fontSize: 13, color: "#4f7bff", display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, textDecoration: "none", cursor: "pointer" }}>
            <Sparkles size={13} />
            Ask AI Copilot
          </Link>
        </div>

        <hr className="section-divider" />

        {/* ── KPI Grid (2×2) ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 48px", marginBottom: 32 }}>
          {kpis.map(kpi => <KPICard key={kpi.label} {...kpi} />)}
        </div>

        <hr className="section-divider" />

        {/* ── Revenue Chart ── */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#888", marginBottom: 16 }}>Monthly Won Revenue</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data.monthly_revenue} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f7bff" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4f7bff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
              <XAxis dataKey="month" tick={{ fill: "#444", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#444", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}K`} />
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6, fontSize: 12 }} formatter={(val: any) => formatCurrency(Number(val))} />
              <Area type="monotone" dataKey="revenue" stroke="#4f7bff" strokeWidth={1.5} fill="url(#revGrad)" name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <hr className="section-divider" />

        {/* ── Bottom row: Hot Leads + Top Agents ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>

          {/* Hot Leads */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#888" }}>Top Scored Active Deals</p>
              <Link href="/leads" style={{ fontSize: 12, color: "#4f7bff", textDecoration: "none" }}>
                View pipeline
              </Link>
            </div>
            <table className="relay-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Value</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead: any) => (
                  <tr key={lead.opportunity_id}>
                    <td>
                      <div className="row-title">{lead.account}</div>
                      <div className="row-sub">{lead.agent}</div>
                    </td>
                    <td style={{ color: "#4f7bff" }}>{formatCurrency(lead.estimated_value)}</td>
                    <td style={{ color: "#555" }}>
                      <span style={{ color: lead.ai_score >= 75 ? "#4ade80" : lead.ai_score >= 50 ? "#f59e0b" : "#f87171" }}>
                        {lead.ai_score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Activity Feed */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#888" }}>AI Activity Feed</p>
            </div>
            <div>
              {activities.map((act) => (
                <div key={act.activity_id} className="insight-row">
                  <div>
                    <div className="insight-name" style={{ fontWeight: 500, fontSize: 13 }}>{act.activity_type} — {act.account_name}</div>
                    <div className="insight-sub" style={{ marginTop: 4 }}>{act.short_description}</div>
                  </div>
                </div>
              ))}
              {activities.length === 0 && (
                <div style={{ fontSize: 13, color: "#555" }}>No recent activity.</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
