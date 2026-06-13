import React from "react";
import { GlassCard, SectionHeader } from "./shared";
import { motion } from "framer-motion";
import { CreditCard, Zap, Users, HardDrive } from "lucide-react";

export function TabBilling() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SectionHeader title="Plan & Billing" subtitle="Manage your subscription and view usage limits" />
      
      <GlassCard className="mb-8" style={{ border: "1px solid rgba(124, 92, 252, 0.4)", background: "linear-gradient(135deg, rgba(124, 92, 252, 0.1), rgba(17, 17, 24, 0.8))" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 12, color: "#a78bfa", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Current Plan</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginTop: 4 }}>Enterprise AI</div>
            <div style={{ fontSize: 14, color: "#d0d0d0", marginTop: 4 }}>$499/mo • Renews on Jul 15, 2026</div>
          </div>
          <button style={{ 
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
            transition: "all 0.2s"
          }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
            Manage Subscription
          </button>
        </div>
      </GlassCard>

      <SectionHeader title="Current Usage" subtitle="Your workspace consumption for the current billing cycle" />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <GlassCard style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ padding: 6, background: "rgba(124, 92, 252, 0.15)", borderRadius: 8 }}>
                <Zap size={16} color="#a78bfa" />
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>AI Tokens Generated</span>
            </div>
            <span style={{ fontSize: 13, color: "#888" }}>4.2M / 10M</span>
          </div>
          <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: "42%" }} transition={{ duration: 1, ease: "easeOut" }} style={{ height: "100%", background: "#7c5cfc", boxShadow: "0 0 10px #7c5cfc" }} />
          </div>
        </GlassCard>

        <GlassCard style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ padding: 6, background: "rgba(79, 209, 197, 0.15)", borderRadius: 8 }}>
                <Users size={16} color="#4fd1c5" />
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>Active Seats</span>
            </div>
            <span style={{ fontSize: 13, color: "#888" }}>4 / 10</span>
          </div>
          <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: "40%" }} transition={{ duration: 1, ease: "easeOut" }} style={{ height: "100%", background: "#4fd1c5", boxShadow: "0 0 10px #4fd1c5" }} />
          </div>
        </GlassCard>

        <GlassCard style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ padding: 6, background: "rgba(245, 158, 11, 0.15)", borderRadius: 8 }}>
                <HardDrive size={16} color="#f59e0b" />
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>Storage Used</span>
            </div>
            <span style={{ fontSize: 13, color: "#888" }}>12GB / 100GB</span>
          </div>
          <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: "12%" }} transition={{ duration: 1, ease: "easeOut" }} style={{ height: "100%", background: "#f59e0b", boxShadow: "0 0 10px #f59e0b" }} />
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}
