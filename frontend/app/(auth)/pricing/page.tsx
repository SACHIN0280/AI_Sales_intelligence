"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Calendar, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

const TIERS = [
  {
    name: "Starter",
    price: "$49",
    period: "per user / month",
    description: "Perfect for small teams getting started with AI sales.",
    icon: <Zap size={20} color="#3b82f6" />,
    features: [
      "Basic AI Lead Scoring",
      "500 Email Drafts / month",
      "Standard Analytics",
      "1 Integration (HubSpot / Salesforce)",
    ],
    buttonText: "Start Starter",
    highlight: false,
    color: "#3b82f6"
  },
  {
    name: "Professional",
    price: "$149",
    period: "per user / month",
    description: "Advanced intelligence for high-performing sales teams.",
    icon: <Sparkles size={20} color="#7c5cfc" />,
    features: [
      "Advanced AI Copilot",
      "Unlimited Email Drafts",
      "Pipeline Risk Analysis",
      "Unlimited Integrations",
      "Custom AI Prompts",
    ],
    buttonText: "Select Professional",
    highlight: true,
    color: "#7c5cfc"
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "annual billing only",
    description: "Secure, dedicated infrastructure for large organizations.",
    icon: <Shield size={20} color="#10b981" />,
    features: [
      "Dedicated LLM Instance",
      "SSO & Advanced Security",
      "Custom Workflows",
      "SLA & 24/7 Support",
      "On-premise deployment options",
    ],
    buttonText: "Contact Sales",
    highlight: false,
    color: "#10b981"
  }
];

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelect = async (plan: string) => {
    setLoading(plan);
    localStorage.setItem("salesmind_plan", plan);
    await new Promise(r => setTimeout(r, 600));
    router.replace("/dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0c", color: "#f0f0f0", fontFamily: "Inter, system-ui, sans-serif" }}>
      
      {/* ── HEADER ── */}
      <header style={{ 
        display: "flex", alignItems: "center", justifyContent: "space-between", 
        padding: "20px 40px", borderBottom: "1px solid #1a1a1a",
        background: "rgba(10, 10, 12, 0.8)", backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 10 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#7c5cfc", display: "inline-block" }} />
          <span style={{ fontSize: 20, fontWeight: 600, color: "#ffffff", letterSpacing: "-0.02em" }}>SalesMind</span>
        </div>

        {/* Demo Blue Button */}
        <button
          style={{
            background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8,
            padding: "10px 20px", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8,
            cursor: "pointer", transition: "background 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#2563eb"}
          onMouseLeave={e => e.currentTarget.style.background = "#3b82f6"}
        >
          <Calendar size={15} />
          Book a Demo
        </button>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 120px" }}>
        
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h1 style={{ fontSize: 42, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 16 }}>
            Choose your AI advantage.
          </h1>
          <p style={{ fontSize: 16, color: "#888", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
            Unlock the full power of LLaMA 3.3 70B for your sales team. Start closing deals faster today.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center" }}>
          {TIERS.map((tier) => (
            <div 
              key={tier.name}
              style={{
                flex: "1 1 300px", maxWidth: 350,
                background: tier.highlight ? "linear-gradient(180deg, #16161c 0%, #111116 100%)" : "#111111",
                border: tier.highlight ? `1px solid ${tier.color}40` : "1px solid #222",
                boxShadow: tier.highlight ? `0 0 30px ${tier.color}15` : "none",
                borderRadius: 16, padding: 32, display: "flex", flexDirection: "column",
                position: "relative", overflow: "hidden"
              }}
            >
              {tier.highlight && (
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 4,
                  background: `linear-gradient(90deg, transparent, ${tier.color}, transparent)`
                }} />
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${tier.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {tier.icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#fff", margin: 0 }}>{tier.name}</h3>
              </div>
              
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 36, fontWeight: 700, color: "#fff" }}>{tier.price}</span>
                {tier.price !== "Custom" && <span style={{ fontSize: 14, color: "#666", marginLeft: 8 }}>{tier.period}</span>}
              </div>

              <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6, minHeight: 45, marginBottom: 32 }}>
                {tier.description}
              </p>

              <button
                onClick={() => handleSelect(tier.name)}
                disabled={loading !== null}
                style={{
                  width: "100%", background: tier.highlight ? tier.color : "#1a1a1a",
                  color: "#fff", border: tier.highlight ? "none" : "1px solid #333",
                  borderRadius: 8, padding: 14, fontSize: 14, fontWeight: 600,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  marginBottom: 32, transition: "all 0.2s", opacity: loading && loading !== tier.name ? 0.5 : 1
                }}
                onMouseEnter={e => {
                  if (tier.highlight) e.currentTarget.style.filter = "brightness(1.1)";
                  else e.currentTarget.style.background = "#252525";
                }}
                onMouseLeave={e => {
                  if (tier.highlight) e.currentTarget.style.filter = "brightness(1)";
                  else e.currentTarget.style.background = "#1a1a1a";
                }}
              >
                {loading === tier.name ? "Processing..." : tier.buttonText}
                {loading !== tier.name && <ArrowRight size={16} />}
              </button>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>
                  Includes:
                </div>
                {tier.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                    <Check size={16} color={tier.color} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 14, color: "#ccc", lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
