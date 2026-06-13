import React, { useState, useEffect } from "react";
import { GlassCard, SectionHeader, ModernToggle } from "./shared";
import { motion } from "framer-motion";
import { Cloud, Calendar, MessageSquare, Video, FileText, Mail, Database, Briefcase } from "lucide-react";
import { toast } from "sonner";

let integrationsList = [
  { id: "salesforce", name: "Salesforce", category: "CRM", icon: Cloud, color: "#00a1e0", connected: true, sync: "Syncing..." },
  { id: "hubspot", name: "HubSpot", category: "CRM", icon: Database, color: "#ff7a59", connected: false },
  { id: "slack", name: "Slack", category: "Communication", icon: MessageSquare, color: "#e01e5a", connected: true, sync: "Synced 2m ago" },
  { id: "gmail", name: "Gmail", category: "Email", icon: Mail, color: "#ea4335", connected: true, sync: "Live" },
  { id: "notion", name: "Notion", category: "Workspace", icon: FileText, color: "#e0e0e0", connected: false },
  { id: "gcal", name: "Google Calendar", category: "Calendar", icon: Calendar, color: "#4285f4", connected: true, sync: "Live" },
  { id: "zoom", name: "Zoom", category: "Video", icon: Video, color: "#2d8cff", connected: false },
  { id: "teams", name: "Microsoft Teams", category: "Communication", icon: Briefcase, color: "#6264a7", connected: false },
];

export function TabIntegrations() {
  const [integrations, setIntegrations] = useState(integrationsList);

  useEffect(() => {
    const saved = localStorage.getItem("salesmind_integrations");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setIntegrations(prev => prev.map(p => {
          const matched = parsed.find((i: any) => i.id === p.id);
          return matched ? { ...p, connected: matched.connected, sync: matched.sync } : p;
        }));
      } catch(e) {}
    }
  }, []);


  const toggleConnection = (id: string) => {
    toast.error("🚀 Premium Feature: Coming in v2.0");
    // Prevent the actual connection toggle for the demo
    // setIntegrations(prev => { ... });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SectionHeader title="Integrations & Apps" subtitle="Connect SalesMind with your existing workspace tools" />
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
        {integrations.map((app) => (
          <GlassCard 
            key={app.id}
            className="group transition-all duration-300"
            style={{ 
              padding: "20px",
              border: app.connected ? "1px solid rgba(124, 92, 252, 0.3)" : "1px solid rgba(255,255,255,0.05)",
              background: app.connected ? "rgba(124, 92, 252, 0.03)" : "rgba(17, 17, 24, 0.4)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ 
                  width: 48, height: 48, borderRadius: 12, 
                  background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: app.connected ? `0 0 15px ${app.color}40` : "none"
                }}>
                  <app.icon size={24} color={app.color} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                    {app.name}
                    {app.connected && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />}
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{app.category}</div>
                </div>
              </div>
              <ModernToggle on={app.connected} onChange={() => toggleConnection(app.id)} />
            </div>
            
            {app.connected && app.sync && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 12, color: "#666" }}>Status</div>
                <div style={{ fontSize: 12, color: app.sync === "Syncing..." ? "#f59e0b" : "#4fd1c5", display: "flex", alignItems: "center", gap: 6 }}>
                  {app.sync === "Syncing..." && (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} style={{ width: 10, height: 10, border: "2px solid #f59e0b", borderTopColor: "transparent", borderRadius: "50%" }} />
                  )}
                  {app.sync}
                </div>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </motion.div>
  );
}
