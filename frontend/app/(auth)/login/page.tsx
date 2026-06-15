"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Sparkles, Brain, Shield, ChevronRight, Zap } from "lucide-react";

// ─── Input Component ────────────────────────────────────────────────────────
function Field({
  label, type = "text", value, onChange, placeholder, error, rightEl, icon: Icon
}: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
  error?: string; rightEl?: React.ReactNode; icon?: any;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ 
        fontSize: 12, fontWeight: 500, color: focused ? "#fff" : "#888", 
        display: "block", marginBottom: 8, transition: "color 0.3s" 
      }}>{label}</label>
      <div style={{ position: "relative" }}>
        {Icon && (
          <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: focused ? "#a78bfa" : "#555", transition: "color 0.3s" }}>
            <Icon size={16} />
          </div>
        )}
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: "100%", background: "rgba(255, 255, 255, 0.03)",
            border: `1px solid ${error ? "#ef4444" : focused ? "rgba(124,92,252,0.5)" : "rgba(255, 255, 255, 0.08)"}`,
            boxShadow: focused && !error ? "0 0 0 4px rgba(124,92,252,0.1), inset 0 0 20px rgba(124,92,252,0.05)" : "none",
            borderRadius: 12, padding: `12px ${rightEl ? 40 : 14}px 12px ${Icon ? 40 : 14}px`,
            fontSize: 14, color: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            backdropFilter: "blur(10px)",
          }}
        />
        {rightEl && (
          <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
            {rightEl}
          </div>
        )}
      </div>
      {error && (
        <p style={{ fontSize: 12, color: "#ef4444", marginTop: 6, fontWeight: 500 }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Floating Card Component ───────────────────────────────────────────────
function FloatingCard({ delay, icon: Icon, title, desc, top, left, right, bottom }: any) {
  return (
    <div
      style={{
        position: "absolute", top, left, right, bottom,
        background: "rgba(15, 15, 20, 0.4)", backdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 16,
        padding: 20, width: 280, boxShadow: "0 24px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
        zIndex: 2
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(124, 92, 252, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(124, 92, 252, 0.3)" }}>
          <Icon size={16} color="#a78bfa" />
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{title}</div>
      </div>
      <div style={{ fontSize: 13, color: "#999", lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────
export default function LoginPage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [siEmail, setSiEmail] = useState("");
  const [siPass, setSiPass] = useState("");
  const [siShowPass, setSiShowPass] = useState(false);
  const [siError, setSiError] = useState("");
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPass, setSuPass] = useState("");
  const [suShowPass, setSuShowPass] = useState(false);
  const [suErrors, setSuErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const setAuthCookie = () => {
    document.cookie = "salesmind_auth=true; path=/; max-age=86400";
  };

  const handleSignIn = async () => {
    setSiError("");
    if (!siEmail || !siPass) { setSiError("Email and password are required."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    if (siEmail === "admin@salesmind.ai" && siPass === "demo1234") {
      setAuthCookie();
      localStorage.setItem("salesmind_user_name", "Sales Admin");
      localStorage.setItem("salesmind_user_email", "admin@salesmind.ai");
      window.location.href = "/dashboard";
    } else {
      setSiError("Invalid credentials. Try admin@salesmind.ai / demo1234");
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    const errs: Record<string, string> = {};
    if (!suName.trim())              errs.name  = "Full name is required.";
    if (!suEmail.includes("@"))      errs.email = "Enter a valid email.";
    if (suPass.length < 6)           errs.pass  = "Password must be at least 6 characters.";
    setSuErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setAuthCookie();
    localStorage.setItem("salesmind_user_name", suName);
    localStorage.setItem("salesmind_user_email", suEmail);
    window.location.href = "/pricing";
  };

  return (
    <div style={{ 
      display: "flex", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif", 
      background: "#050505", overflow: "hidden", position: "relative" 
    }}>
      {/* ─── Ambient Background Effects ─── */}
      <div className="ambient-bg" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {/* Subtle Noise Texture */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
        
        {/* Glow Orbs */}
        <div
          style={{
            position: "absolute", top: "10%", left: "15%", width: 600, height: 600,
            background: "radial-gradient(circle, rgba(124,92,252,0.15) 0%, rgba(0,0,0,0) 70%)",
            borderRadius: "50%", filter: "blur(60px)", mixBlendMode: "screen",
            transform: `translate(${mousePos.x * 0.05}px, ${mousePos.y * 0.05}px)`,
            transition: "transform 0.1s ease-out"
          }}
        />
        <div
          style={{
            position: "absolute", bottom: "10%", right: "15%", width: 500, height: 500,
            background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(0,0,0,0) 70%)",
            borderRadius: "50%", filter: "blur(60px)", mixBlendMode: "screen",
            transform: `translate(${mousePos.x * -0.05}px, ${mousePos.y * -0.05}px)`,
            transition: "transform 0.1s ease-out"
          }}
        />
      </div>

      {/* ─── LEFT SIDE: Cinematic Hero ─── */}
      <div className="left-side" style={{
        flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "0 8%", position: "relative", zIndex: 1,
        borderRight: "1px solid rgba(255,255,255,0.05)"
      }}>
        <div>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 60 }}>
            <div 
              style={{ width: 16, height: 16, borderRadius: "50%", background: "linear-gradient(135deg, #a78bfa, #7c5cfc)" }} 
            />
            <span style={{ fontSize: 24, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em" }}>SalesMind AI</span>
          </div>

          <h1 style={{ fontSize: 56, fontWeight: 700, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.04em", marginBottom: 24 }}>
            Intelligence for<br/>
            <span style={{ background: "linear-gradient(to right, #a78bfa, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              modern sales teams.
            </span>
          </h1>
          <p style={{ fontSize: 18, color: "#888", lineHeight: 1.6, maxWidth: 480, marginBottom: 60 }}>
            Predict closures, draft hyper-personalized outreach, and uncover pipeline risks instantly with LLaMA 3.3 70B.
          </p>
        </div>

        {/* Floating Abstract UI */}
        <div style={{ position: "relative", height: 300, width: "100%", maxWidth: 600 }}>
          <FloatingCard 
            delay={0.2} icon={Brain} title="AI Deal Scoring" 
            desc="Analyzes 50+ intent signals in real-time to surface high-probability accounts."
            top={0} left={0}
          />
          <FloatingCard 
            delay={0.4} icon={Zap} title="Instant Outreach" 
            desc="Generates hyper-personalized cold emails based on LinkedIn and web activity."
            top={80} left={180}
          />
          <FloatingCard 
            delay={0.6} icon={Shield} title="Pipeline Protection" 
            desc="Automatically flags stalled deals and recommends next-step actions."
            top={160} left={0}
          />
        </div>
      </div>

      {/* ─── RIGHT SIDE: Auth Portal ─── */}
      <div className="right-side" style={{
        flex: "0 0 500px", display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 1, padding: 40
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          {/* Glassmorphism Card */}
          <div style={{
            background: "rgba(15, 15, 18, 0.6)", backdropFilter: "blur(32px) saturate(150%)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "40px 32px",
            boxShadow: "0 30px 60px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)",
            position: "relative", overflow: "hidden"
          }}>
            {/* Top Shine */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(124,92,252,0.5), transparent)" }} />

            {/* Tabs */}
            <div style={{ display: "flex", gap: 24, marginBottom: 36, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {(["signin", "signup"] as const).map(t => (
                <button
                  key={t} onClick={() => { setTab(t); setSiError(""); setSuErrors({}); }}
                  style={{
                    background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 15, fontWeight: 500,
                    paddingBottom: 12, color: tab === t ? "#fff" : "#666", position: "relative", transition: "color 0.3s",
                    borderBottom: tab === t ? "2px solid #7c5cfc" : "none"
                  }}
                >
                  {t === "signin" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>

            <div>
              {tab === "signin" ? (
                <div>
                  <Field label="Work Email" type="email" value={siEmail} onChange={setSiEmail} placeholder="you@company.com" />
                  <Field
                    label="Password" type={siShowPass ? "text" : "password"} value={siPass} onChange={setSiPass} placeholder="••••••••" error={siError}
                    rightEl={
                      <button onClick={() => setSiShowPass(!siShowPass)} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", padding: 4 }}>
                        {siShowPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                  />
                  
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24, marginTop: -8 }}>
                    <a href="#" style={{ fontSize: 12, color: "#888", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#7c5cfc"} onMouseLeave={e => e.currentTarget.style.color = "#888"}>
                      Forgot password?
                    </a>
                  </div>

                  <button
                    onClick={handleSignIn} disabled={loading}
                    style={{
                      width: "100%", background: "linear-gradient(135deg, #7c5cfc, #5b3dcf)", border: "1px solid rgba(124,92,252,0.4)",
                      borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 600, color: "#fff", cursor: "pointer",
                      fontFamily: "inherit", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      boxShadow: "0 8px 20px rgba(124,92,252,0.25), inset 0 1px 1px rgba(255,255,255,0.2)",
                      transition: "all 0.3s", opacity: loading ? 0.7 : 1
                    }}
                    onMouseEnter={e => { if(!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(124,92,252,0.3), inset 0 1px 1px rgba(255,255,255,0.2)"; } }}
                    onMouseLeave={e => { if(!loading) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(124,92,252,0.25), inset 0 1px 1px rgba(255,255,255,0.2)"; } }}
                  >
                    {loading ? "Authenticating..." : "Sign in securely"}
                    {!loading && <ChevronRight size={16} />}
                  </button>
                </div>
              ) : (
                <div>
                  <Field label="Full Name" value={suName} onChange={setSuName} placeholder="Sarah Johnson" error={suErrors.name} />
                  <Field label="Work Email" type="email" value={suEmail} onChange={setSuEmail} placeholder="you@company.com" error={suErrors.email} />
                  <Field
                    label="Password" type={suShowPass ? "text" : "password"} value={suPass} onChange={setSuPass} placeholder="At least 6 characters" error={suErrors.pass}
                    rightEl={
                      <button onClick={() => setSuShowPass(!suShowPass)} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", padding: 4 }}>
                        {siShowPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                  />

                  <button
                    onClick={handleSignUp} disabled={loading}
                    style={{
                      width: "100%", background: "linear-gradient(135deg, #7c5cfc, #5b3dcf)", border: "1px solid rgba(124,92,252,0.4)",
                      borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 600, color: "#fff", cursor: "pointer",
                      fontFamily: "inherit", marginTop: 12, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      boxShadow: "0 8px 20px rgba(124,92,252,0.25), inset 0 1px 1px rgba(255,255,255,0.2)",
                      transition: "all 0.3s", opacity: loading ? 0.7 : 1
                    }}
                    onMouseEnter={e => { if(!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(124,92,252,0.3), inset 0 1px 1px rgba(255,255,255,0.2)"; } }}
                    onMouseLeave={e => { if(!loading) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(124,92,252,0.25), inset 0 1px 1px rgba(255,255,255,0.2)"; } }}
                  >
                    {loading ? "Creating workspace..." : "Create account"}
                    {!loading && <ChevronRight size={16} />}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      
      {/* Responsive Media Query Style */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 1000px) {
          .ambient-bg, .left-side { display: none !important; }
          .right-side { flex: 1 !important; padding: 20px !important; }
        }
      `}} />
    </div>
  );
}
