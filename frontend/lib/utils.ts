import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

export function formatNumber(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
}

export function getScoreColor(score: number): string {
  if (score >= 75) return "#10B981";
  if (score >= 50) return "#F59E0B";
  return "#EF4444";
}

export function getStatusClass(status: string): string {
  switch (status) {
    case "Hot Lead":
      return "status-hot";
    case "Warm Lead":
      return "status-warm";
    case "Cold Lead":
      return "status-cold";
    case "Closed":
      return "status-closed";
    default:
      return "status-warm";
  }
}

export function getStatusEmoji(status: string): string {
  switch (status) {
    case "Hot Lead": return "🔥";
    case "Warm Lead": return "⚡";
    case "Cold Lead": return "❄️";
    case "Closed": return "✅";
    default: return "📋";
  }
}

export function timeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return past.toLocaleDateString();
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function generateAvatarColor(name: string): string {
  const colors = [
    "from-violet-500 to-purple-700",
    "from-cyan-500 to-blue-700",
    "from-emerald-500 to-green-700",
    "from-orange-500 to-red-700",
    "from-pink-500 to-rose-700",
    "from-indigo-500 to-violet-700",
    "from-amber-500 to-orange-700",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}
