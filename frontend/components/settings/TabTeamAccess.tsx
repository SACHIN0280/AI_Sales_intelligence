import React, { useState, useEffect } from "react";
import { GlassCard, SectionHeader, Label, TextInput } from "./shared";
import { motion } from "framer-motion";
import { Users, UserPlus, Shield, User, MoreHorizontal, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const initialTeamList = [
  { id: 1, name: "Sales Admin (You)", email: "admin@salesmind.ai", role: "Admin", status: "Active", avatar: "SA" },
  { id: 2, name: "Versie Hillebrand", email: "versie@salesmind.ai", role: "Sales Rep", status: "Active", avatar: "VH" },
  { id: 3, name: "Cecily Lampkin", email: "cecily@salesmind.ai", role: "Sales Manager", status: "Active", avatar: "CL" },
  { id: 4, name: "Lajuana Vencill", email: "lajuana@salesmind.ai", role: "Sales Rep", status: "Invited", avatar: "LV" },
];

export function TabTeamAccess() {
  const [team, setTeam] = useState(initialTeamList);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Sales Rep");

  const getRoleBadge = (role: string) => {
    switch(role) {
      case "Admin": return { bg: "rgba(124, 92, 252, 0.15)", color: "#a78bfa", icon: Shield };
      case "Sales Manager": return { bg: "rgba(79, 209, 197, 0.15)", color: "#4fd1c5", icon: Users };
      default: return { bg: "rgba(255, 255, 255, 0.08)", color: "#d0d0d0", icon: User };
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("salesmind_user_name");
      const storedEmail = localStorage.getItem("salesmind_user_email");
      if (storedName || storedEmail) {
        setTeam(prev => {
          const newTeam = [...prev];
          if (storedName) {
            newTeam[0].name = `${storedName} (You)`;
            const parts = storedName.split(" ").filter(Boolean);
            if (parts.length >= 2) {
              newTeam[0].avatar = (parts[0][0] + parts[1][0]).toUpperCase();
            } else if (parts.length === 1) {
              newTeam[0].avatar = parts[0].slice(0, 2).toUpperCase();
            }
          }
          if (storedEmail) newTeam[0].email = storedEmail;
          return newTeam;
        });
      }
    }
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SectionHeader title="Workspace Members" subtitle="Manage your team's access and roles within SalesMind" />
      
      <GlassCard className="mb-8" style={{ padding: 0 }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>4 Members</div>
          <button style={{ 
            background: "linear-gradient(135deg, #7c5cfc, #5b3dcf)", color: "#fff", border: "none",
            padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(124,92,252,0.3)"
          }}
          onClick={() => toast.error("🚀 Premium Feature: Coming in v2.0")}
          >
            <UserPlus size={16} />
            Invite Member
          </button>
        </div>
        
        {team.map((member, i) => {
          const badge = getRoleBadge(member.role);
          return (
            <div key={member.id} style={{ 
              padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
              borderBottom: i < team.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              background: "transparent", transition: "background 0.2s"
            }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#2a2a2a", border: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "#aaa" }}>
                  {member.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                    {member.name}
                    {member.status === "Invited" && <span style={{ fontSize: 11, background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", padding: "2px 8px", borderRadius: 10 }}>Invited</span>}
                  </div>
                  <div style={{ fontSize: 13, color: "#888" }}>{member.email}</div>
                </div>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <div style={{ background: badge.bg, color: badge.color, padding: "4px 12px", borderRadius: 12, fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                  <badge.icon size={12} />
                  {member.role}
                </div>
                <button style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer" }}>
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </GlassCard>

      <SectionHeader title="Quick Invite" subtitle="Send an invitation link directly to a colleague" />
      <GlassCard>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}>
          <div style={{ flex: "1 1 200px" }}>
            <Label>Email Address</Label>
            <TextInput value={inviteEmail} onChange={setInviteEmail} placeholder="colleague@company.com" />
          </div>
          <div style={{ flex: "1 1 120px" }}>
            <Label>Role</Label>
            <select
              value={inviteRole}
              onChange={e => setInviteRole(e.target.value)}
              style={{
                width: "100%", height: 42, background: "rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10,
                padding: "0 14px", fontSize: 14, color: "#e0e0e0", outline: "none",
                fontFamily: "inherit", appearance: "none"
              }}
            >
              <option value="Admin">Admin</option>
              <option value="Sales Manager">Sales Manager</option>
              <option value="Sales Rep">Sales Rep</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
          <button style={{ 
            height: 42, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff", padding: "0 24px", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer",
            transition: "all 0.2s"
          }} 
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"} 
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          onClick={() => toast.error("🚀 Premium Feature: Coming in v2.0")}
          >
            Send Invite
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
