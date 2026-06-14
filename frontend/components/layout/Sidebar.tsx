"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Brain,
  Users,
  Calendar,
  BarChart2,
  MessageSquare,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  BookOpen,
  Zap,
} from "lucide-react";

const navItems = [
  { href: "/copilot",   label: "AI Copilot",   icon: Brain        },
  { href: "/leads",     label: "Leads",        icon: Users        },
  { href: "/meeting",   label: "Meetings",     icon: Calendar     },
  { href: "/analytics", label: "Analytics",    icon: BarChart2    },
  { href: "/followup",  label: "Messages",     icon: MessageSquare},
  { href: "/insights",  label: "Reports",      icon: FileText     },
  { href: "/docs",      label: "Docs",         icon: BookOpen     },
  { href: "/dashboard", label: "Dashboard",    icon: BarChart2    },
  { href: "/scoring",   label: "Lead Scoring", icon: Zap          },
  { href: "/settings",  label: "Settings",     icon: Settings     },
];

export default function Sidebar({ collapsed, setCollapsed, isMobile }: { collapsed: boolean, setCollapsed: (c: boolean | ((prev: boolean) => boolean)) => void, isMobile?: boolean }) {
  const pathname = usePathname();
  const router   = useRouter();

  const [userName, setUserName] = useState("Sales Admin");
  const [userEmail, setUserEmail] = useState("admin@salesmind.ai");
  const [userInitials, setUserInitials] = useState("SA");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("salesmind_user_name");
      const storedEmail = localStorage.getItem("salesmind_user_email");
      if (storedName) {
        setUserName(storedName);
        const parts = storedName.split(" ").filter(Boolean);
        if (parts.length >= 2) {
          setUserInitials((parts[0][0] + parts[1][0]).toUpperCase());
        } else if (parts.length === 1) {
          setUserInitials(parts[0].slice(0, 2).toUpperCase());
        }
      }
      if (storedEmail) {
        setUserEmail(storedEmail);
      }
    }
  }, []);

  const handleLogout = () => {
    document.cookie = "salesmind_auth=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <aside
      style={{
        width: (collapsed && isMobile) ? 0 : (collapsed ? 56 : 260),
        minWidth: (collapsed && isMobile) ? 0 : (collapsed ? 56 : 260),
        background: "#0a0a0a",
        borderRight: "1px solid #1c1c1c",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 50,
        transition: "width 0.2s ease, min-width 0.2s ease",
        overflow: "hidden",
      }}
    >
      {/* ── Logo ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "18px 0" : "18px 14px 18px 16px",
          borderBottom: "1px solid #1c1c1c",
          flexShrink: 0,
        }}
      >
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "#7c5cfc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Brain size={15} color="#fff" />
            </div>
            <span
              style={{
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}
            >
              SalesMind
            </span>
          </div>
        )}

        {collapsed && (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "#7c5cfc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Brain size={15} color="#fff" />
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand" : "Collapse"}
          style={{
            background: "transparent",
            border: "1px solid #1c1c1c",
            borderRadius: 6,
            width: 22,
            height: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#555",
            flexShrink: 0,
            position: collapsed ? "absolute" : "relative",
            right: collapsed ? -999 : "auto",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "#333";
            (e.currentTarget as HTMLElement).style.color = "#888";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "#1c1c1c";
            (e.currentTarget as HTMLElement).style.color = "#555";
          }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* Collapsed expand button (only on desktop) */}
      {collapsed && !isMobile && (
        <button
          onClick={() => setCollapsed(false)}
          style={{
            background: "transparent",
            border: "none",
            padding: "10px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#555",
            flexShrink: 0,
          }}
          title="Expand sidebar"
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#888")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#555")}
        >
          <ChevronRight size={14} />
        </button>
      )}

      {/* ── Nav ── */}
      <nav
        style={{
          flex: 1,
          overflowY: "auto",
          padding: collapsed ? "8px 6px" : "8px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(href + "/");

          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: collapsed ? 0 : 10,
                justifyContent: collapsed ? "center" : "flex-start",
                padding: collapsed ? "10px 0" : "10px 14px",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 400,
                color: active ? "#ffffff" : "#888",
                background: active ? "#13131f" : "transparent",
                borderLeft: active ? "2px solid #7c5cfc" : "2px solid transparent",
                marginLeft: active ? -1 : 0,
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "#161616";
                  (e.currentTarget as HTMLElement).style.color = "#ccc";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#888";
                }
              }}
            >
              <Icon
                size={16}
                color={active ? "#7c5cfc" : "#555"}
                style={{ flexShrink: 0 }}
              />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom: User row ── */}
      <div
        style={{
          borderTop: "1px solid #1c1c1c",
          padding: collapsed ? "12px 0" : "12px 12px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: collapsed ? 0 : 10,
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "#7c5cfc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 600,
              color: "#fff",
              flexShrink: 0,
              letterSpacing: "0.03em",
            }}
          >
            {userInitials}
          </div>

          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#e0e0e0",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {userName}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#555",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {userEmail}
              </div>
            </div>
          )}

          {!collapsed && (
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{
                color: "#555",
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#888")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "#555")}
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
