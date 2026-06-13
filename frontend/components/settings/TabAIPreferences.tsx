import React, { useState } from "react";
import { GlassCard, SectionHeader, AnimatedSlider, ModernToggle, Divider } from "./shared";
import { BrainCircuit, MessageSquare, Zap, Sparkles, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

export const SegmentedControl = ({ options, selected, onChange }: { options: string[], selected: string, onChange: (v: string) => void }) => (
  <div style={{ display: "flex", background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: 4, position: "relative" }}>
    {options.map((opt) => (
      <div
        key={opt}
        onClick={() => onChange(opt)}
        style={{
          flex: 1, textAlign: "center", padding: "10px 0", fontSize: 13, fontWeight: 500,
          color: selected === opt ? "#fff" : "#888", cursor: "pointer", position: "relative", zIndex: 1,
          transition: "color 0.2s"
        }}
      >
        {opt}
        {selected === opt && (
          <motion.div
            layoutId="segment-active"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
              background: "linear-gradient(180deg, rgba(124,92,252,0.4), rgba(91,61,207,0.4))",
              borderRadius: 8, zIndex: -1,
              boxShadow: "0 2px 10px rgba(124,92,252,0.2), inset 0 1px 1px rgba(255,255,255,0.2)"
            }}
          />
        )}
      </div>
    ))}
  </div>
);

export function TabAIPreferences() {
  const [tone, setTone] = useState("Professional");
  const [creativity, setCreativity] = useState(60);
  const [intensity, setIntensity] = useState(80);
  const [autoTag, setAutoTag] = useState(true);
  const [followUp, setFollowUp] = useState(true);
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SectionHeader title="AI Persona & Tone" subtitle="Configure how the Copilot communicates and formats summaries" />
      
      <GlassCard className="mb-8">
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <MessageSquare size={16} color="#7c5cfc" />
            <span style={{ fontSize: 14, color: "#e0e0e0", fontWeight: 500 }}>Email & Chat Tone</span>
          </div>
          <SegmentedControl 
            options={["Executive", "Professional", "Concise", "Persuasive"]} 
            selected={tone} 
            onChange={setTone} 
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Sparkles size={16} color="#f59e0b" />
                <span style={{ fontSize: 14, color: "#e0e0e0", fontWeight: 500 }}>Creativity Level</span>
              </div>
              <span style={{ fontSize: 12, color: "#888", fontWeight: 600 }}>{creativity}%</span>
            </div>
            <AnimatedSlider value={creativity} min={0} max={100} onChange={setCreativity} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "#666" }}>
              <span>Deterministic</span>
              <span>Highly Creative</span>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Zap size={16} color="#ef4444" />
                <span style={{ fontSize: 14, color: "#e0e0e0", fontWeight: 500 }}>Recommendation Intensity</span>
              </div>
              <span style={{ fontSize: 12, color: "#888", fontWeight: 600 }}>{intensity}%</span>
            </div>
            <AnimatedSlider value={intensity} min={0} max={100} onChange={setIntensity} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "#666" }}>
              <span>Passive</span>
              <span>Aggressive</span>
            </div>
          </div>
        </div>
      </GlassCard>

      <Divider />

      <SectionHeader title="Automation Engine" subtitle="Smart behaviors triggered automatically by AI analysis" />
      <GlassCard>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BrainCircuit size={20} color="#7c5cfc" />
            </div>
            <div>
              <div style={{ fontSize: 14, color: "#e0e0e0", fontWeight: 500 }}>Smart Auto-Tagging</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>Automatically apply tags to deals based on meeting transcripts</div>
            </div>
          </div>
          <ModernToggle on={autoTag} onChange={setAutoTag} />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <SlidersHorizontal size={20} color="#4fd1c5" />
            </div>
            <div>
              <div style={{ fontSize: 14, color: "#e0e0e0", fontWeight: 500 }}>Predictive Follow-ups</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>Draft follow-up emails in the background immediately after a meeting ends</div>
            </div>
          </div>
          <ModernToggle on={followUp} onChange={setFollowUp} />
        </div>
      </GlassCard>
    </motion.div>
  );
}
