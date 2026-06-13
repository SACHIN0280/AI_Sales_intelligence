import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

export const GlassCard = ({ children, className = "", style = {} }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className={className}
    style={{
      background: "rgba(17, 17, 24, 0.4)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.05)",
      borderRadius: "16px",
      padding: "24px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      position: "relative",
      overflow: "hidden",
      ...style
    }}
  >
    <div style={{
      position: "absolute", top: 0, left: "20%", right: "20%", height: "1px",
      background: "linear-gradient(90deg, transparent, rgba(124, 92, 252, 0.3), transparent)"
    }} />
    {children}
  </motion.div>
);

export const Label = ({ children, style = {} }: { children: React.ReactNode, style?: React.CSSProperties }) => (
  <label style={{ fontSize: 13, color: "#888", display: "block", marginBottom: 8, fontWeight: 500, letterSpacing: "-0.01em", ...style }}>
    {children}
  </label>
);

export const TextInput = ({
  value, onChange, placeholder, type = "text", icon: Icon
}: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; icon?: React.ElementType;
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      {Icon && (
        <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: focused ? "#7c5cfc" : "#555", transition: "color 0.2s" }}>
          <Icon size={16} />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", height: 42, background: "rgba(0,0,0,0.2)",
          border: `1px solid ${focused ? "rgba(124,92,252,0.5)" : "rgba(255,255,255,0.08)"}`,
          boxShadow: focused ? "0 0 0 4px rgba(124,92,252,0.1) inset, 0 0 10px rgba(124,92,252,0.1)" : "none",
          borderRadius: 10, padding: `0 ${Icon ? "40px" : "14px"}`,
          fontSize: 14, color: "#e0e0e0", outline: "none",
          boxSizing: "border-box", fontFamily: "inherit",
          transition: "all 0.2s ease",
        }}
      />
    </div>
  );
};

export const ModernToggle = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) => {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{
        width: 44, height: 24, borderRadius: 12, cursor: "pointer",
        background: on ? "linear-gradient(135deg, #7c5cfc, #5b3dcf)" : "rgba(255,255,255,0.05)",
        border: `1px solid ${on ? "transparent" : "rgba(255,255,255,0.1)"}`,
        position: "relative", flexShrink: 0,
        boxShadow: on ? "0 0 12px rgba(124,92,252,0.4)" : "inset 0 2px 4px rgba(0,0,0,0.2)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <motion.div
        animate={{ left: on ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{
          position: "absolute", top: 1.5,
          width: 19, height: 19, borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );
};

export const AnimatedSlider = ({ value, min, max, onChange, step = 1 }: { value: number, min: number, max: number, step?: number, onChange: (v: number) => void }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ position: "relative", height: 20, display: "flex", alignItems: "center" }}>
      <div style={{ position: "absolute", width: "100%", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
        <motion.div
          animate={{ width: `${percentage}%` }}
          transition={{ ease: "easeOut", duration: 0.2 }}
          style={{ height: "100%", background: "linear-gradient(90deg, #5b3dcf, #4fd1c5)", boxShadow: "0 0 10px rgba(79, 209, 197, 0.5)" }}
        />
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          width: "100%", position: "absolute", opacity: 0, cursor: "pointer", height: "100%"
        }}
      />
      <motion.div
        animate={{ left: `calc(${percentage}% - 8px)` }}
        transition={{ ease: "easeOut", duration: 0.2 }}
        style={{
          position: "absolute", width: 16, height: 16, background: "#fff",
          borderRadius: "50%", boxShadow: "0 2px 5px rgba(0,0,0,0.3)", pointerEvents: "none",
          border: "2px solid #4fd1c5"
        }}
      />
    </div>
  );
};

export const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div style={{ marginBottom: 24 }}>
    <h3 style={{ fontSize: 16, fontWeight: 600, color: "#f0f0f0", letterSpacing: "-0.01em", margin: 0 }}>{title}</h3>
    {subtitle && <p style={{ fontSize: 13, color: "#666", marginTop: 4, margin: "4px 0 0 0" }}>{subtitle}</p>}
  </div>
);

export const Divider = () => (
  <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05) 20%, rgba(255,255,255,0.05) 80%, transparent)", margin: "32px 0" }} />
);
