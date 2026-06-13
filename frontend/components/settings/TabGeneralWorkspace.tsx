import React, { useState, useEffect } from "react";
import { GlassCard, SectionHeader, Label, TextInput, ModernToggle, Divider } from "./shared";
import { User, Building, Mail, Globe, Palette, Layout, Type } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export function TabGeneral() {
  const [name, setName] = useState("Sales Admin");
  const [email, setEmail] = useState("admin@salesmind.ai");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("salesmind_user_name");
      const storedEmail = localStorage.getItem("salesmind_user_email");
      if (storedName) setName(storedName);
      if (storedEmail) setEmail(storedEmail);
    }
  }, []);
  const [company, setCompany] = useState("SalesMind AI");
  const [domain, setDomain] = useState("salesmind.ai");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SectionHeader title="Profile Settings" subtitle="Manage your personal information and contact details" />
      <GlassCard className="mb-8">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, marginBottom: 24 }}>
          <div>
            <Label>Full Name</Label>
            <TextInput value={name} onChange={setName} placeholder="Your name" icon={User} />
          </div>
          <div>
            <Label>Work Email</Label>
            <TextInput value={email} onChange={setEmail} type="email" placeholder="you@company.com" icon={Mail} />
          </div>
        </div>
      </GlassCard>

      <SectionHeader title="Company Details" subtitle="Information about your organization" />
      <GlassCard>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
          <div>
            <Label>Company Name</Label>
            <TextInput value={company} onChange={setCompany} placeholder="Acme Corp" icon={Building} />
          </div>
          <div>
            <Label>Primary Domain</Label>
            <TextInput value={domain} onChange={setDomain} placeholder="acme.com" icon={Globe} />
          </div>
        </div>
      </GlassCard>

      <Divider />

      <SectionHeader title="Danger Zone" subtitle="Irreversible account actions" />
      <GlassCard style={{ border: "1px solid rgba(239, 68, 68, 0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h4 style={{ color: "#ef4444", fontSize: 14, fontWeight: 500, margin: "0 0 4px 0" }}>Delete Account</h4>
            <p style={{ color: "#888", fontSize: 13, margin: 0 }}>Permanently remove your personal account and all its data.</p>
          </div>
          <button style={{
            background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#ef4444", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
            transition: "background 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
          onClick={() => toast.error("🚀 Premium Feature: Coming in v2.0")}
          >
            Delete Account
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function TabWorkspace() {
  const [animations, setAnimations] = useState(true);
  const [compact, setCompact] = useState(false);
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SectionHeader title="Workspace Appearance" subtitle="Customize how SalesMind looks and feels on your device" />
      
      <GlassCard className="mb-8">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Layout size={20} color="#7c5cfc" />
            </div>
            <div>
              <div style={{ fontSize: 14, color: "#e0e0e0", fontWeight: 500 }}>Compact Mode</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>Reduce padding and margin to fit more data on screen</div>
            </div>
          </div>
          <ModernToggle on={compact} onChange={setCompact} />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Palette size={20} color="#4fd1c5" />
            </div>
            <div>
              <div style={{ fontSize: 14, color: "#e0e0e0", fontWeight: 500 }}>Cinematic Animations</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>Enable blur effects, glowing hover states, and transitions</div>
            </div>
          </div>
          <ModernToggle on={animations} onChange={setAnimations} />
        </div>
      </GlassCard>

      <SectionHeader title="Theme Accent" subtitle="Select your workspace's primary color" />
      <GlassCard>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {[
            { color: "#7c5cfc", name: "SalesMind Purple", active: true },
            { color: "#4fd1c5", name: "Electric Cyan", active: false },
            { color: "#f59e0b", name: "Warning Amber", active: false },
            { color: "#ec4899", name: "Neon Pink", active: false },
            { color: "#3b82f6", name: "Ocean Blue", active: false },
          ].map(theme => (
            <div key={theme.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <div style={{ 
                width: 48, height: 48, borderRadius: "50%", background: theme.color,
                boxShadow: theme.active ? `0 0 0 2px #141414, 0 0 0 4px ${theme.color}, 0 0 20px ${theme.color}` : "none",
                transition: "all 0.2s"
              }} />
              <span style={{ fontSize: 11, color: theme.active ? "#fff" : "#666", fontWeight: theme.active ? 500 : 400 }}>
                {theme.name.split(" ")[1] || theme.name}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}
