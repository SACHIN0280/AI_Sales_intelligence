import React, { useState } from "react";
import { GlassCard, SectionHeader, Label, TextInput, Divider } from "./shared";
import { Eye, EyeOff, Activity, Cpu, Database, Server } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const usageData = [
  { time: "00:00", tokens: 1200 },
  { time: "04:00", tokens: 800 },
  { time: "08:00", tokens: 3400 },
  { time: "12:00", tokens: 5600 },
  { time: "16:00", tokens: 4100 },
  { time: "20:00", tokens: 2300 },
  { time: "23:59", tokens: 1800 },
];

export function TabAPI() {
  const [apiKey, setApiKey] = useState("gsk_••••••••••••••••••••••••••••••••");
  const [showKey, setShowKey] = useState(false);
  const [model, setModel] = useState("llama-3.3-70b-versatile");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SectionHeader title="API Infrastructure" subtitle="Manage your LLM connections and monitor real-time token usage" />
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Connection Status", value: "Healthy", icon: Activity, color: "#4ade80" },
          { label: "Avg Latency", value: "240ms", icon: Server, color: "#4fd1c5" },
          { label: "Tokens Today", value: "19,200", icon: Database, color: "#7c5cfc" },
        ].map((stat, i) => (
          <GlassCard key={i} style={{ padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: 8, borderRadius: 8 }}>
                <stat.icon size={16} color={stat.color} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#888" }}>{stat.label}</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginTop: 2 }}>{stat.value}</div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mb-8">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <Label style={{ margin: 0 }}>API Key Configuration</Label>
          <div style={{ fontSize: 12, color: "#4ade80", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
            Verified
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            style={{
              width: "100%", background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
              padding: "12px 40px 12px 14px",
              fontSize: 14, color: "#e0e0e0", outline: "none",
              fontFamily: "JetBrains Mono, monospace",
            }}
          />
          <button
            onClick={() => setShowKey(!showKey)}
            style={{
              position: "absolute", right: 12, top: "50%",
              transform: "translateY(-50%)", background: "none", border: "none",
              cursor: "pointer", color: "#666"
            }}
          >
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </GlassCard>

      <SectionHeader title="Active Model" subtitle="Select the foundational model for the AI Copilot" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { id: "llama-3.3-70b-versatile", name: "LLaMA 3.3 70B", provider: "Groq", speed: "Ultra-fast", capability: "High Reasoning" },
          { id: "llama-3.1-8b-instant", name: "LLaMA 3.1 8B", provider: "Groq", speed: "Instant", capability: "General Tasks" },
          { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", provider: "Mistral", speed: "Fast", capability: "Balanced" },
          { id: "gemma2-9b-it", name: "Gemma 2 9B", provider: "Google", speed: "Fast", capability: "Creative" },
        ].map(m => (
          <GlassCard 
            key={m.id}
            className="cursor-pointer transition-all duration-200 hover:bg-white/5"
            style={{ 
              padding: 16,
              border: model === m.id ? "1px solid #7c5cfc" : "1px solid rgba(255,255,255,0.05)",
              boxShadow: model === m.id ? "0 0 15px rgba(124,92,252,0.15) inset" : "none"
            }}
          >
            <div onClick={() => setModel(m.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Cpu size={16} color={model === m.id ? "#7c5cfc" : "#888"} />
                  <span style={{ fontSize: 14, fontWeight: 500, color: model === m.id ? "#fff" : "#d0d0d0" }}>{m.name}</span>
                </div>
                {model === m.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7c5cfc", boxShadow: "0 0 8px #7c5cfc" }} />}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontSize: 10, padding: "2px 8px", background: "rgba(255,255,255,0.05)", borderRadius: 10, color: "#aaa" }}>{m.provider}</span>
                <span style={{ fontSize: 10, padding: "2px 8px", background: "rgba(255,255,255,0.05)", borderRadius: 10, color: "#aaa" }}>{m.speed}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <SectionHeader title="Token Usage" subtitle="Daily consumption across all workspace members" />
      <GlassCard style={{ height: 250, padding: "24px 24px 0 0" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={usageData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c5cfc" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7c5cfc" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#666", fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#666", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: "#1a1a24", border: "1px solid #333", borderRadius: 8, fontSize: 12, color: "#fff" }}
              itemStyle={{ color: "#7c5cfc" }}
            />
            <Area type="monotone" dataKey="tokens" stroke="#7c5cfc" strokeWidth={2} fillOpacity={1} fill="url(#colorTokens)" />
          </AreaChart>
        </ResponsiveContainer>
      </GlassCard>
    </motion.div>
  );
}
