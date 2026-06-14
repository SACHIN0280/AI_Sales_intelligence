"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Brain, Zap, Shield, Sparkles, Target, BarChart3 } from "lucide-react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#050505", 
      color: "#e0e0e0", 
      fontFamily: "Inter, system-ui, sans-serif",
      overflowX: "hidden",
      position: "relative"
    }}>
      {/* ─── Background Ambient Effects ─── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {/* Subtle Noise */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
        {/* Orbs */}
        <div style={{
          position: "absolute", top: "-10%", right: "-5%", width: "50vw", height: "50vw",
          background: "radial-gradient(circle, rgba(124,92,252,0.08) 0%, rgba(0,0,0,0) 70%)",
          borderRadius: "50%", filter: "blur(80px)", mixBlendMode: "screen",
          transform: `translate(${mousePos.x * -0.02}px, ${mousePos.y * -0.02}px)`,
          transition: "transform 0.2s ease-out"
        }} />
        <div style={{
          position: "absolute", bottom: "-20%", left: "-10%", width: "60vw", height: "60vw",
          background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, rgba(0,0,0,0) 70%)",
          borderRadius: "50%", filter: "blur(100px)", mixBlendMode: "screen",
          transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)`,
          transition: "transform 0.2s ease-out"
        }} />
      </div>

      {/* ─── Header ─── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 72, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 5%", transition: "all 0.3s",
        background: scrolled ? "rgba(5, 5, 5, 0.8)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: "linear-gradient(135deg, #a78bfa, #7c5cfc)" }} />
          <span style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>SalesMind AI</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link href="/login" style={{ color: "#a0a0a0", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "#a0a0a0"}>
            Sign In
          </Link>
          <Link href="/login" style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            padding: "8px 16px", borderRadius: 8, color: "#fff", textDecoration: "none",
            fontSize: 14, fontWeight: 500, transition: "all 0.2s"
          }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
            Get Started
          </Link>
        </div>
      </header>

      {/* ─── Hero Section ─── */}
      <section style={{
        position: "relative", zIndex: 10, paddingTop: 180, paddingBottom: 100,
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
        paddingLeft: "5%", paddingRight: "5%"
      }}>
        <div style={{ 
          display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(124,92,252,0.1)", 
          border: "1px solid rgba(124,92,252,0.2)", padding: "6px 14px", borderRadius: 100,
          color: "#a78bfa", fontSize: 13, fontWeight: 500, marginBottom: 32
        }}>
          <Sparkles size={14} />
          <span>LLaMA 3.3 70B Integration Now Live</span>
        </div>

        <h1 style={{ 
          fontSize: "clamp(48px, 6vw, 80px)", fontWeight: 800, color: "#fff", 
          lineHeight: 1.1, letterSpacing: "-0.04em", maxWidth: 900, marginBottom: 24 
        }}>
          Intelligence for <br />
          <span style={{ 
            background: "linear-gradient(135deg, #a78bfa 0%, #3b82f6 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>modern sales teams.</span>
        </h1>

        <p style={{ fontSize: "clamp(18px, 2vw, 22px)", color: "#888", maxWidth: 680, lineHeight: 1.6, marginBottom: 48 }}>
          Predict closures, draft hyper-personalized outreach, and uncover pipeline risks instantly. Your entire sales process, supercharged by AI.
        </p>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/login" style={{
            background: "linear-gradient(135deg, #7c5cfc, #5b3dcf)", border: "1px solid rgba(124,92,252,0.4)",
            padding: "16px 32px", borderRadius: 12, color: "#fff", textDecoration: "none",
            fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 8px 24px rgba(124,92,252,0.3)", transition: "all 0.2s"
          }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(124,92,252,0.4)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(124,92,252,0.3)"; }}>
            Start for free <ArrowRight size={18} />
          </Link>
          <a href="#features" style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
            padding: "16px 32px", borderRadius: 12, color: "#e0e0e0", textDecoration: "none",
            fontSize: 16, fontWeight: 600, transition: "all 0.2s", backdropFilter: "blur(10px)"
          }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}>
            See how it works
          </a>
        </div>
      </section>

      {/* ─── Dashboard Preview Image (Mockup) ─── */}
      <section style={{ position: "relative", zIndex: 10, padding: "0 5%", maxWidth: 1200, margin: "0 auto", marginBottom: 120 }}>
        <div style={{ 
          background: "rgba(15, 15, 18, 0.4)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24, padding: "12px", backdropFilter: "blur(24px)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6)"
        }}>
          <div style={{ 
            background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, 
            height: 600, overflow: "hidden", display: "flex", flexDirection: "column" 
          }}>
            {/* Mockup Header */}
            <div style={{ height: 48, borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", padding: "0 20px", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10b981" }} />
            </div>
            {/* Mockup Content */}
            <div style={{ flex: 1, padding: 40, display: "flex", gap: 40, opacity: 0.8 }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ height: 120, background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }} />
                <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }} />
              </div>
              <div style={{ width: 320, background: "linear-gradient(180deg, rgba(124,92,252,0.05) 0%, rgba(255,255,255,0.02) 100%)", borderRadius: 12, border: "1px solid rgba(124,92,252,0.1)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section id="features" style={{ position: "relative", zIndex: 10, padding: "80px 5%", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 16 }}>
            Everything you need to close.
          </h2>
          <p style={{ fontSize: 18, color: "#888", maxWidth: 600, margin: "0 auto" }}>
            SalesMind AI connects directly to your CRM to provide real-time insights, drafted emails, and risk analysis.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {/* Card 1 */}
          <div style={{ 
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 32,
            transition: "all 0.3s", cursor: "default"
          }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(-4px)"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(124,92,252,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
              <Target color="#a78bfa" size={24} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 12 }}>AI Deal Scoring</h3>
            <p style={{ color: "#888", lineHeight: 1.6 }}>Analyze 50+ intent signals in real-time to surface high-probability accounts before your competitors do.</p>
          </div>

          {/* Card 2 */}
          <div style={{ 
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 32,
            transition: "all 0.3s", cursor: "default"
          }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(-4px)"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
              <Zap color="#60a5fa" size={24} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 12 }}>Instant Outreach</h3>
            <p style={{ color: "#888", lineHeight: 1.6 }}>Generate hyper-personalized cold emails based on LinkedIn, company news, and CRM history.</p>
          </div>

          {/* Card 3 */}
          <div style={{ 
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 32,
            transition: "all 0.3s", cursor: "default"
          }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(-4px)"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
              <Shield color="#f87171" size={24} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 12 }}>Pipeline Protection</h3>
            <p style={{ color: "#888", lineHeight: 1.6 }}>Automatically flag stalled deals and get AI-recommended next steps to unblock them instantly.</p>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section style={{ position: "relative", zIndex: 10, padding: "120px 5%", textAlign: "center" }}>
        <div style={{ 
          background: "linear-gradient(180deg, rgba(124,92,252,0.1) 0%, rgba(15,15,18,0) 100%)",
          border: "1px solid rgba(124,92,252,0.2)", borderRadius: 32, padding: "80px 20px", maxWidth: 1000, margin: "0 auto",
          position: "relative", overflow: "hidden"
        }}>
          {/* Top Edge Highlight */}
          <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: "linear-gradient(90deg, transparent, rgba(124,92,252,0.8), transparent)" }} />
          
          <h2 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 24 }}>
            Ready to scale your sales?
          </h2>
          <p style={{ fontSize: 20, color: "#a0a0a0", maxWidth: 600, margin: "0 auto", marginBottom: 40 }}>
            Join modern sales teams using SalesMind AI to close deals faster.
          </p>
          <Link href="/login" style={{
            background: "#fff", color: "#000", padding: "18px 40px", borderRadius: 100,
            fontSize: 18, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10,
            transition: "transform 0.2s, box-shadow 0.2s"
          }} onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(255,255,255,0.2)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>
            Get Started Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "40px 5%", textAlign: "center", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "linear-gradient(135deg, #a78bfa, #7c5cfc)" }} />
          <span style={{ fontSize: 16, fontWeight: 600, color: "#888" }}>SalesMind AI</span>
        </div>
        <p style={{ fontSize: 13, color: "#555" }}>
          &copy; {new Date().getFullYear()} SalesMind AI. Intelligence for modern teams.
        </p>
      </footer>
    </div>
  );
}
