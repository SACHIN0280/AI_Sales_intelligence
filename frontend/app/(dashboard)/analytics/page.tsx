"use client";

import React, { useEffect, useState } from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { api } from "@/lib/api";
import { Zap } from "lucide-react";
import TopBar from "@/components/layout/TopBar";

const CHART_COLORS = ["#4f7bff", "#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#a855f7", "#ec4899", "#ef4444"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [analyticsRes, dashboardRes] = await Promise.all([
          api.signal.analytics(),
          api.signal.dashboard()
        ]);
        setData({ ...analyticsRes, kpis: dashboardRes.kpis });
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
        <TopBar title="Analytics" />
        <div className="page" style={{ paddingTop: 32 }}>
          <div className="animate-pulse flex gap-2 items-center text-gray-500">
            <Zap size={14} color="#4f7bff" /> Syncing analytics from CSV engine...
          </div>
        </div>
      </div>
    );
  }

  if (!data) return <div className="page text-red-500">Failed to load data</div>;

  const kpis = [
    { label: "Total Revenue", value: formatCurrency(data.kpis.total_revenue), accent: true },
    { label: "Global Win Rate", value: `${data.kpis.win_rate.toFixed(1)}%`, accent: false },
    { label: "Avg Deal Size", value: formatCurrency(data.kpis.avg_deal_size), accent: false },
    { label: "Active Deals", value: data.kpis.active_deals.toString(), accent: false },
  ];

  // Map funnel to array
  const funnelData = [
    { stage: "Prospecting", count: data.funnel.Prospecting || 0 },
    { stage: "Engaging", count: data.funnel.Engaging || 0 },
    { stage: "Won", count: data.funnel.Won || 0 },
    { stage: "Lost", count: data.funnel.Lost || 0 },
  ];
  
  // Sort sectors by revenue
  const topSectors = data.sector_revenue.sort((a: any, b: any) => b.revenue - a.revenue).slice(0, 5);

  return (
    <div className="min-h-screen pb-12">
      <TopBar title="Analytics" subtitle="AI-powered performance metrics" />

      <div className="page">

        <div style={{ marginBottom: 32 }}>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">AI-powered performance metrics and predictive intelligence</p>
        </div>

        {/* KPI Strip */}
        <div style={{ display: "flex", flexDirection: "row", gap: 48, marginBottom: 32 }}>
          {kpis.map(({ label, value, accent }) => (
            <div key={label}>
              <div style={{ fontSize: 22, fontWeight: 600, color: accent ? "#4f7bff" : "#f0f0f0", letterSpacing: "-0.02em", marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 12, color: "#555" }}>{label}</div>
            </div>
          ))}
        </div>

        <hr className="section-divider" />

        {/* Monthly Revenue Chart */}
        <div style={{ paddingTop: 24, marginBottom: 32 }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#888", marginBottom: 16 }}>Monthly Won Revenue</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.monthly_revenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f7bff" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4f7bff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
              <XAxis dataKey="month" tick={{ fill: "#444", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#444", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}K`} />
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6, fontSize: 12 }} formatter={(val: any) => formatCurrency(Number(val))} />
              <Area type="monotone" dataKey="revenue" stroke="#4f7bff" strokeWidth={1.5} fill="url(#rev)" name="Actual Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <hr className="section-divider" />

        {/* Two column: Region Pie + Funnel */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 32 }}>

          {/* Regional Distribution */}
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#888", marginBottom: 16 }}>Regional Revenue Distribution</p>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{ width: 130, height: 130, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.region_revenue} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={3} dataKey="revenue" nameKey="region">
                      {data.region_revenue.map((_: any, i: number) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6, fontSize: 12 }} formatter={(val: any) => formatCurrency(Number(val))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <table className="relay-table" style={{ flex: 1 }}>
                <tbody>
                  {data.region_revenue.map((d: any, i: number) => (
                    <tr key={i}>
                      <td style={{ padding: "6px 0" }}>
                        <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: CHART_COLORS[i % CHART_COLORS.length], marginRight: 8 }} />
                        <span style={{ color: "#888", fontSize: 13 }}>{d.region}</span>
                      </td>
                      <td style={{ padding: "6px 0", textAlign: "right", color: "#d0d0d0", fontSize: 13 }}>{formatCurrency(d.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Acquisition Funnel */}
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#888", marginBottom: 16 }}>Pipeline Funnel</p>
            <div>
              {funnelData.map((stage, i) => {
                const maxCount = Math.max(...funnelData.map(s => s.count));
                const pct = Math.round((stage.count / maxCount) * 100);
                return (
                  <div key={i} className="insight-row" style={{ flexDirection: "column", alignItems: "stretch" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                      <span style={{ color: "#888" }}>{stage.stage}</span>
                      <span style={{ color: "#555" }}>{stage.count} deals</span>
                    </div>
                    <div style={{ height: 3, background: "#1e1e1e", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: CHART_COLORS[i], borderRadius: 2 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <hr className="section-divider" />

        {/* Two column: Products + Sectors */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 32 }}>

          {/* Product Performance */}
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#888", marginBottom: 16 }}>Product Performance</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.product_revenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#444", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}K`} />
                <YAxis dataKey="product" type="category" width={100} tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6, fontSize: 12 }} formatter={(val: any) => formatCurrency(Number(val))} />
                <Bar dataKey="revenue" fill="#4f7bff" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Sectors */}
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#888", marginBottom: 16 }}>Top Industry Sectors</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topSectors} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#444", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}K`} />
                <YAxis dataKey="sector" type="category" width={100} tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6, fontSize: 12 }} formatter={(val: any) => formatCurrency(Number(val))} />
                <Bar dataKey="revenue" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
        </div>

      </div>
    </div>
  );
}
