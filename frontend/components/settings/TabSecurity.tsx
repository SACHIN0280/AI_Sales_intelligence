import React, { useState, useEffect } from "react";
import { GlassCard, SectionHeader, ModernToggle, Divider } from "./shared";
import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck, Smartphone, Monitor, Key, LogOut } from "lucide-react";

export function TabSecurity() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [sso, setSso] = useState(true);

  useEffect(() => {
    const saved2fa = localStorage.getItem("salesmind_2fa");
    if (saved2fa) setTwoFactor(saved2fa === "true");
    
    const savedSso = localStorage.getItem("salesmind_sso");
    if (savedSso) setSso(savedSso === "true");
  }, []);

  const handle2fa = (val: boolean) => {
    setTwoFactor(val);
    localStorage.setItem("salesmind_2fa", val.toString());
  };

  const handleSso = (val: boolean) => {
    setSso(val);
    localStorage.setItem("salesmind_sso", val.toString());
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SectionHeader title="Security Overview" subtitle="Monitor your account safety and access controls" />
      
      <GlassCard className="mb-8" style={{ border: "1px solid rgba(74, 222, 128, 0.2)", background: "rgba(74, 222, 128, 0.02)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(74, 222, 128, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShieldCheck size={24} color="#4ade80" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>Security Score: 85/100</div>
            <div style={{ fontSize: 13, color: "#4ade80", marginTop: 2 }}>Your account is well protected. Enable 2FA to reach 100/100.</div>
          </div>
        </div>
      </GlassCard>

      <SectionHeader title="Authentication" subtitle="Manage how you log into SalesMind" />
      <GlassCard className="mb-8">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Smartphone size={20} color="#7c5cfc" />
            </div>
            <div>
              <div style={{ fontSize: 14, color: "#e0e0e0", fontWeight: 500 }}>Two-Factor Authentication (2FA)</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>Require an extra security code when logging in</div>
            </div>
          </div>
          <ModernToggle on={twoFactor} onChange={handle2fa} />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Key size={20} color="#4fd1c5" />
            </div>
            <div>
              <div style={{ fontSize: 14, color: "#e0e0e0", fontWeight: 500 }}>SAML Single Sign-On</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>Allow users to log in using Okta or Google Workspace</div>
            </div>
          </div>
          <ModernToggle on={sso} onChange={handleSso} />
        </div>
      </GlassCard>

      <Divider />

      <SectionHeader title="Active Sessions" subtitle="Manage devices currently logged into your account" />
      <GlassCard style={{ padding: 0 }}>
        <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Monitor size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                MacBook Pro 16"
                <span style={{ fontSize: 10, background: "rgba(74, 222, 128, 0.15)", color: "#4ade80", padding: "2px 6px", borderRadius: 10 }}>Current Session</span>
              </div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>San Francisco, CA • IP: 192.168.1.1</div>
            </div>
          </div>
        </div>
        <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Smartphone size={20} color="#888" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#d0d0d0" }}>iPhone 14 Pro</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>San Jose, CA • Last active 2h ago</div>
            </div>
          </div>
          <button style={{ background: "transparent", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", padding: "6px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <LogOut size={14} />
            Revoke
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
