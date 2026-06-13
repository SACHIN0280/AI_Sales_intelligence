"use client";

import React, { useEffect, useState } from "react";
import TopBar from "@/components/layout/TopBar";
import { api } from "@/lib/api";
import { Zap, Trophy, Target, TrendingUp } from "lucide-react";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function LeaderboardPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [managers, setManagers] = useState<string[]>([]);
  const [selectedManager, setSelectedManager] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.signal.leaderboard();
        setAgents(res.leaderboard);
        
        // Extract unique managers
        const uniqueManagers = Array.from(new Set(res.leaderboard.map((a: any) => a.manager))).sort() as string[];
        setManagers(uniqueManagers);
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
        <TopBar title="Sales Leaderboard" />
        <div className="page" style={{ paddingTop: 32 }}>
          <div className="animate-pulse flex gap-2 items-center text-gray-500">
            <Zap size={14} color="#4f7bff" /> Syncing team metrics from CSV engine...
          </div>
        </div>
      </div>
    );
  }

  const filteredAgents = selectedManager === "All" 
    ? agents 
    : agents.filter(a => a.manager === selectedManager);

  return (
    <div className="min-h-screen pb-12">
      <TopBar title="Sales Leaderboard" subtitle="Team performance and productivity metrics" />

      <div className="page" style={{ paddingTop: 32 }}>

        {/* ── Page header ── */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: "#f0f0f0" }}>Sales Leaderboard</h1>
            <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Ranked by total won revenue across all regions</p>
          </div>
          
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#555" }}>Filter by Manager:</span>
            <select
              value={selectedManager}
              onChange={e => setSelectedManager(e.target.value)}
              style={{
                background: "#111118", border: "1px solid #2a2a2a", borderRadius: "6px",
                padding: "8px 12px", fontSize: "13px", color: "#c8c8c8", outline: "none"
              }}
            >
              <option value="All">All Managers</option>
              {managers.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Table ── */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #222" }}>
              <th style={{ textAlign: "center", fontSize: 13, fontWeight: 400, color: "#555", padding: "8px 16px 8px 0", width: 40 }}>Rank</th>
              <th style={{ textAlign: "left", fontSize: 13, fontWeight: 400, color: "#555", padding: "8px 16px 8px 0" }}>Agent</th>
              <th style={{ textAlign: "left", fontSize: 13, fontWeight: 400, color: "#555", padding: "8px 24px 8px 0" }}>Manager & Region</th>
              <th style={{ textAlign: "right", fontSize: 13, fontWeight: 400, color: "#555", padding: "8px 24px 8px 0" }}>Won Deals</th>
              <th style={{ textAlign: "right", fontSize: 13, fontWeight: 400, color: "#555", padding: "8px 24px 8px 0" }}>Win Rate</th>
              <th style={{ textAlign: "right", fontSize: 13, fontWeight: 400, color: "#555", padding: "8px 16px 8px 0" }}>Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgents.map((agent, idx) => {
              const rank = selectedManager === "All" ? idx + 1 : agents.findIndex(a => a.agent === agent.agent) + 1;
              return (
                <tr
                  key={agent.agent}
                  style={{ borderBottom: "1px solid #1a1a1a" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.012)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  {/* Rank */}
                  <td style={{ padding: "16px 16px 16px 0", verticalAlign: "middle", textAlign: "center" }}>
                    {rank === 1 ? <Trophy size={16} color="#fbbf24" style={{ margin: "0 auto" }} /> : 
                     rank === 2 ? <Trophy size={16} color="#9ca3af" style={{ margin: "0 auto" }} /> : 
                     rank === 3 ? <Trophy size={16} color="#b45309" style={{ margin: "0 auto" }} /> : 
                     <span style={{ fontSize: 13, color: "#555", fontWeight: 500 }}>{rank}</span>}
                  </td>

                  {/* Agent */}
                  <td style={{ padding: "16px 16px 16px 0", verticalAlign: "middle" }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: rank <= 3 ? "#e8e8e8" : "#d0d0d0" }}>{agent.agent}</div>
                    <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{agent.active} active deals</div>
                  </td>

                  {/* Manager/Region */}
                  <td style={{ padding: "16px 24px 16px 0", verticalAlign: "middle", fontSize: 13, color: "#888" }}>
                    <div>{agent.manager}</div>
                    <div style={{ color: "#555", marginTop: 2 }}>{agent.region}</div>
                  </td>

                  {/* Won Deals */}
                  <td style={{ padding: "16px 24px 16px 0", verticalAlign: "middle", textAlign: "right" }}>
                    <span style={{ fontSize: 14, color: "#d0d0d0" }}>{agent.won}</span>
                  </td>

                  {/* Win Rate */}
                  <td style={{ padding: "16px 24px 16px 0", verticalAlign: "middle", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: agent.win_rate >= 60 ? "rgba(74,222,128,0.1)" : "rgba(251,191,36,0.1)", color: agent.win_rate >= 60 ? "#4ade80" : "#fbbf24", padding: "4px 8px", borderRadius: "4px", fontSize: 13, fontWeight: 500 }}>
                      <Target size={12} />
                      {agent.win_rate.toFixed(1)}%
                    </div>
                  </td>

                  {/* Revenue */}
                  <td style={{ padding: "16px 16px 16px 0", verticalAlign: "middle", textAlign: "right", fontSize: 15, fontWeight: 500, color: "#4f7bff" }}>
                    {formatCurrency(agent.revenue)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
