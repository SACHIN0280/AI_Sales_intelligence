"use client";

import React, { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, Layout, BrainCircuit, Activity, 
  Cloud, Users, ShieldCheck, CreditCard, Sparkles, TrendingUp
} from "lucide-react";

import { TabGeneral, TabWorkspace } from "@/components/settings/TabGeneralWorkspace";
import { TabAIPreferences } from "@/components/settings/TabAIPreferences";
import { TabAPI } from "@/components/settings/TabAPI";
import { TabIntegrations } from "@/components/settings/TabIntegrations";
import { TabTeamAccess } from "@/components/settings/TabTeamAccess";
import { TabSecurity } from "@/components/settings/TabSecurity";
import { TabBilling } from "@/components/settings/TabBilling";
import { GlassCard } from "@/components/settings/shared";

const tabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "workspace", label: "Workspace", icon: Layout },
  { id: "ai", label: "AI Preferences", icon: BrainCircuit },
  { id: "api", label: "API & Models", icon: Activity },
  { id: "integrations", label: "Integrations", icon: Cloud },
  { id: "team", label: "Team Access", icon: Users },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "billing", label: "Plan & Billing", icon: CreditCard },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 48, background: "radial-gradient(circle at 50% 0%, rgba(124, 92, 252, 0.05) 0%, transparent 50%)" }}>
      <TopBar title="Control Center" subtitle="Manage your AI-native sales operating system" />

      <div style={{ padding: "40px 48px", maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "240px 1fr 300px", gap: 48, alignItems: "start" }}>
        
        {/* ── Left Column: Navigation ── */}
        <div style={{ position: "sticky", top: 100 }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: "#f0f0f0", marginBottom: 4, letterSpacing: "-0.02em" }}>Settings</h1>
            <p style={{ fontSize: 13, color: "#666" }}>Manage your workspace and AI</p>
          </div>
          
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "10px 16px",
                    borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500,
                    background: active ? "rgba(124, 92, 252, 0.1)" : "transparent",
                    color: active ? "#fff" : "#888",
                    transition: "all 0.2s", textAlign: "left"
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.color = "#ccc";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#888";
                    }
                  }}
                >
                  <tab.icon size={16} color={active ? "#a78bfa" : "#666"} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── Center Column: Content ── */}
        <div style={{ minHeight: 600 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "general" && <TabGeneral />}
              {activeTab === "workspace" && <TabWorkspace />}
              {activeTab === "ai" && <TabAIPreferences />}
              {activeTab === "api" && <TabAPI />}
              {activeTab === "integrations" && <TabIntegrations />}
              {activeTab === "team" && <TabTeamAccess />}
              {activeTab === "security" && <TabSecurity />}
              {activeTab === "billing" && <TabBilling />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Right Column: AI Insights Panel ── */}
        <div style={{ position: "sticky", top: 100 }}>
          <GlassCard style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <Sparkles size={18} color="#f59e0b" />
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>AI Insights</h3>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ padding: "14px", background: "rgba(124, 92, 252, 0.05)", borderRadius: 12, border: "1px solid rgba(124, 92, 252, 0.1)" }}>
                <div style={{ fontSize: 13, color: "#e0e0e0", fontWeight: 500, marginBottom: 4 }}>Enable Smart Follow-ups</div>
                <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>Teams using automated follow-ups see a 24% increase in response rates.</div>
                <button 
                  onClick={() => setActiveTab("ai")}
                  style={{ background: "none", border: "none", color: "#a78bfa", fontSize: 12, fontWeight: 600, marginTop: 8, cursor: "pointer", padding: 0 }}
                >
                  Configure AI →
                </button>
              </div>

              <div style={{ padding: "14px", background: "rgba(79, 209, 197, 0.05)", borderRadius: 12, border: "1px solid rgba(79, 209, 197, 0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <TrendingUp size={14} color="#4fd1c5" />
                  <div style={{ fontSize: 13, color: "#e0e0e0", fontWeight: 500 }}>Usage Up 14%</div>
                </div>
                <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>Token usage increased this week. You have 5.8M tokens remaining in your plan.</div>
              </div>

              <div style={{ padding: "14px", background: "rgba(255, 255, 255, 0.03)", borderRadius: 12, border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <div style={{ fontSize: 13, color: "#e0e0e0", fontWeight: 500, marginBottom: 4 }}>Workspace Health: 98/100</div>
                <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>Security and team access roles are fully configured.</div>
              </div>
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
