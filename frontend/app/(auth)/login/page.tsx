"use client";

import React, { useState } from "react";
import { Eye, EyeOff, ChevronRight } from "lucide-react";

// ─── Input Component ───
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
            borderRadius: 12, padding: `12px ${rightEl ? 40 : 14}px 12px ${Icon ? 40 : 14}px`,
            fontSize: 14, color: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit",
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

// ─── Main Page Component ───
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

      {/* ─── LEFT SIDE: Text Only (No Effects) ─── */}
      <div style={{
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
            <span style={{ color: "#a78bfa" }}>
              modern sales teams.
            </span>
          </h1>
          <p style={{ fontSize: 18, color: "#888", lineHeight: 1.6, maxWidth: 480, marginBottom: 60 }}>
            Predict closures, draft hyper-personalized outreach, and uncover pipeline risks instantly with LLaMA 3.3 70B.
          </p>
        </div>
      </div>

      {/* ─── RIGHT SIDE: Auth Portal (Container) ─── */}
      <div style={{
        flex: "0 0 500px", display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 1, padding: 40
      }}>
        <div 
          style={{ width: "100%", maxWidth: 400 }}
        >
          {/* Container Card */}
          <div style={{
            background: "rgba(15, 15, 18, 0.6)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "40px 32px",
            position: "relative", overflow: "hidden"
          }}>
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
                      fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      opacity: loading ? 0.7 : 1
                    }}
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
                      fontFamily: "inherit", marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    {loading ? "Creating workspace..." : "Create account"}
                    {!loading && <ChevronRight size={16} />}
                  </button>
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "32px 0" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
              <span style={{ fontSize: 12, color: "#555", fontWeight: 500 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
            </div>

            {/* Google Auth Button */}
            <button
              style={{
                width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 500, color: "#d0d0d0",
                cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
      
      {/* Responsive Media Query Style */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 1000px) {
          body > div > div:first-of-type { display: none !important; }
          body > div > div:last-of-type { flex: 1 !important; padding: 20px !important; }
        }
      `}} />
    </div>
  );
}
