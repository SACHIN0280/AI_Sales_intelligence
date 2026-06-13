"use client";

import { Bell } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header
      style={{
        height: 52,
        background: "#141414",
        borderBottom: "1px solid #1e1e1e",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 48px",
        position: "sticky",
        top: 0,
        zIndex: 40,
        flexShrink: 0,
      }}
    >
      {/* Left: title + subtitle */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ color: "#f0f0f0", fontSize: 14, fontWeight: 500 }}>
          {title}
        </span>
        {subtitle && (
          <>
            <span style={{ color: "#2a2a2a", fontSize: 13 }}>/</span>
            <span style={{ color: "#555", fontSize: 13 }}>{subtitle}</span>
          </>
        )}
      </div>

      {/* Right: bell + avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          style={{
            background: "transparent", border: "none", padding: 6,
            borderRadius: 6, cursor: "pointer", display: "flex",
            alignItems: "center", color: "#444", position: "relative",
          }}
          title="Notifications"
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#777")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "#444")}
        >
          <Bell size={15} />
          <span
            style={{
              position: "absolute", top: 5, right: 5,
              width: 5, height: 5, borderRadius: "50%",
              background: "#4f7bff", border: "1.5px solid #141414",
            }}
          />
        </button>

        <div
          style={{
            width: 26, height: 26, borderRadius: "50%",
            background: "#2a2a2a", border: "1px solid #333",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 600, color: "#888",
            cursor: "pointer", flexShrink: 0,
          }}
          title="Sachin"
        >
          SC
        </div>
      </div>
    </header>
  );
}
