"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("salesmind_sidebar");
    if (saved) setCollapsed(saved === "true");
  }, []);

  const handleSetCollapsed = (val: boolean | ((prev: boolean) => boolean)) => {
    setCollapsed((prev) => {
      const next = typeof val === "function" ? val(prev) : val;
      localStorage.setItem("salesmind_sidebar", String(next));
      return next;
    });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#141414", color: "#e0e0e0" }}>
      {/* Fixed sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={handleSetCollapsed} />

      {/* Main content area */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: collapsed ? 56 : 260, // accommodate fixed sidebar dynamically
          minHeight: "100vh",
          transition: "margin-left 0.2s ease",
        }}
      >
        {children}
      </main>
    </div>
  );
}
