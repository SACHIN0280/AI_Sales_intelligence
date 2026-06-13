import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["Inter", "sans-serif"],
        heading: ["Space Grotesk", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
      },
      colors: {
        // Base backgrounds
        base:     "#060610",
        surface:  "#0b0b1a",
        card:     "#0f0f22",
        elevated: "#161630",
        hover:    "#1a1a38",
        // Brand
        blue: {
          DEFAULT: "#3b82f6",
          light:   "#60a5fa",
          dark:    "#2563eb",
        },
        cyan: {
          DEFAULT: "#06b6d4",
          light:   "#22d3ee",
          dark:    "#0891b2",
        },
        violet: {
          DEFAULT: "#8b5cf6",
          light:   "#a78bfa",
          dark:    "#7c3aed",
        },
        emerald: {
          DEFAULT: "#10b981",
          light:   "#34d399",
        },
        amber: {
          DEFAULT: "#f59e0b",
          light:   "#fcd34d",
        },
        red: {
          DEFAULT: "#ef4444",
          light:   "#fca5a5",
        },
        // Borders
        "border-subtle":  "rgba(255,255,255,0.04)",
        "border-default": "rgba(255,255,255,0.08)",
        "border-medium":  "rgba(255,255,255,0.14)",
        "border-accent":  "rgba(59,130,246,0.35)",
        "border-glow":    "rgba(6,182,212,0.35)",
        // Text
        "text-primary":   "#f0f4ff",
        "text-secondary": "#8892b0",
        "text-muted":     "#4a5568",
        "text-dim":       "#2d3748",
      },
      backgroundImage: {
        "gradient-radial":   "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "glass-gradient":    "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
        "hero-gradient":     "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.25) 0%, rgba(6,6,16,0) 70%)",
        "blue-glow":         "radial-gradient(ellipse at center, rgba(59,130,246,0.15) 0%, transparent 70%)",
        "violet-glow":       "radial-gradient(ellipse at center, rgba(139,92,246,0.12) 0%, transparent 70%)",
        "cyan-glow":         "radial-gradient(ellipse at center, rgba(6,182,212,0.12) 0%, transparent 70%)",
        "chat-gradient":     "linear-gradient(180deg, #060610 0%, #080816 100%)",
        "sidebar-gradient":  "linear-gradient(180deg, #080814 0%, #060610 100%)",
        "input-gradient":    "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.06))",
      },
      boxShadow: {
        glass:         "0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
        "glass-hover": "0 8px 40px rgba(0,0,0,0.5), 0 0 20px rgba(59,130,246,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
        "glow-blue":   "0 0 20px rgba(59,130,246,0.4), 0 0 40px rgba(59,130,246,0.15)",
        "glow-cyan":   "0 0 20px rgba(6,182,212,0.4), 0 0 40px rgba(6,182,212,0.15)",
        "glow-violet": "0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.15)",
        "glow-sm":     "0 0 10px rgba(59,130,246,0.25)",
        card:          "0 2px 16px rgba(0,0,0,0.4)",
        elevated:      "0 8px 40px rgba(0,0,0,0.6)",
        "inner-glow":  "inset 0 0 20px rgba(59,130,246,0.05)",
      },
      animation: {
        "fade-in":    "fadeIn 0.4s ease forwards",
        "slide-up":   "slideUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards",
        "scale-in":   "scaleIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards",
        "float":      "float 6s ease-in-out infinite",
        "float-slow": "floatSlow 8s ease-in-out infinite",
        "shimmer":    "shimmer 1.8s linear infinite",
        "glow-blue":  "glowPulseBlue 2.5s ease-in-out infinite",
        "glow-cyan":  "glowPulseCyan 2.5s ease-in-out infinite",
        "glow-pulse": "glowPulseBlue 2s ease-in-out infinite",
        "spin-slow":  "spinSlow 8s linear infinite",
        "pulse-slow": "pulse 3.5s cubic-bezier(0.4,0,0.6,1) infinite",
        "blink":      "blink 0.8s step-end infinite",
        "grid-drift": "gridDrift 20s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%":   { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-12px)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%":       { transform: "translateY(-8px) rotate(2deg)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glowPulseBlue: {
          "0%, 100%": { boxShadow: "0 0 12px rgba(59,130,246,0.3)" },
          "50%":       { boxShadow: "0 0 28px rgba(59,130,246,0.6), 0 0 12px rgba(6,182,212,0.4)" },
        },
        glowPulseCyan: {
          "0%, 100%": { boxShadow: "0 0 12px rgba(6,182,212,0.3)" },
          "50%":       { boxShadow: "0 0 28px rgba(6,182,212,0.6)" },
        },
        spinSlow: {
          to: { transform: "rotate(360deg)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%":       { opacity: "0" },
        },
        gridDrift: {
          "0%":   { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "64px 64px" },
        },
      },
      borderRadius: {
        xl:   "14px",
        "2xl": "20px",
        "3xl": "28px",
        "4xl": "36px",
      },
      backdropBlur: {
        xs: "2px",
        sm: "6px",
        md: "12px",
        lg: "20px",
        xl: "32px",
      },
    },
  },
  plugins: [],
};

export default config;
