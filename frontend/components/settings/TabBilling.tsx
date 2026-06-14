import React, { useEffect, useState } from "react";
import { GlassCard, SectionHeader } from "./shared";
import { motion } from "framer-motion";
import { CreditCard, Zap, Users, HardDrive } from "lucide-react";
import { useRouter } from "next/navigation";

export function TabBilling() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState("Enterprise");

  useEffect(() => {
    const savedPlan = localStorage.getItem("salesmind_plan");
    if (savedPlan) {
      setCurrentPlan(savedPlan);
    }
  }, []);

  const getPlanDetails = () => {
    switch (currentPlan) {
      case "Starter": return { price: "$49/mo", limits: { tokens: "1.2M / 2M", seats: "1 / 3", storage: "2GB / 10GB", pTokens: 12, pSeats: 33, pStorage: 20 } };
      case "Professional": return { price: "$149/mo", limits: { tokens: "4.2M / 10M", seats: "4 / 10", storage: "12GB / 100GB", pTokens: 42, pSeats: 40, pStorage: 12 } };
      case "Enterprise": default: return { price: "Custom", limits: { tokens: "Unlimited", seats: "12 / 50", storage: "80GB / 1TB", pTokens: 10, pSeats: 24, pStorage: 8 } };
    }
  };

  const details = getPlanDetails();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SectionHeader title="Plan & Billing" subtitle="Manage your subscription and view usage limits" />
      
      <GlassCard className="mb-8" style={{ border: "1px solid rgba(124, 92, 252, 0.4)", background: "linear-gradient(135deg, rgba(124, 92, 252, 0.1), rgba(17, 17, 24, 0.8))" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 12, color: "#a78bfa", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Current Plan</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginTop: 4 }}>{currentPlan} AI</div>
            <div style={{ fontSize: 14, color: "#d0d0d0", marginTop: 4 }}>{details.price} • Renews on Jul 15, 2026</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ 
              background: "rgba(124,92,252,0.1)", border: "1px solid rgba(124,92,252,0.3)",
              color: "#a78bfa", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
              transition: "all 0.2s"
            }} onClick={() => router.push("/pricing")}
               onMouseEnter={e => e.currentTarget.style.background = "rgba(124,92,252,0.2)"} 
               onMouseLeave={e => e.currentTarget.style.background = "rgba(124,92,252,0.1)"}>
              Change Plan
            </button>
          </div>
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
            <span style={{ fontSize: 13, color: "#888" }}>{details.limits.tokens}</span>
          </div>
          <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${details.limits.pTokens}%` }} transition={{ duration: 1, ease: "easeOut" }} style={{ height: "100%", background: "#7c5cfc", boxShadow: "0 0 10px #7c5cfc" }} />
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
            <span style={{ fontSize: 13, color: "#888" }}>{details.limits.seats}</span>
          </div>
          <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${details.limits.pSeats}%` }} transition={{ duration: 1, ease: "easeOut" }} style={{ height: "100%", background: "#4fd1c5", boxShadow: "0 0 10px #4fd1c5" }} />
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
            <span style={{ fontSize: 13, color: "#888" }}>{details.limits.storage}</span>
          </div>
          <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${details.limits.pStorage}%` }} transition={{ duration: 1, ease: "easeOut" }} style={{ height: "100%", background: "#f59e0b", boxShadow: "0 0 10px #f59e0b" }} />
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}
