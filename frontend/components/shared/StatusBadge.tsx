import { cn, getStatusClass } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  showDot?: boolean;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, showDot = true, size = "md" }: StatusBadgeProps) {
  // Determine dot color based on status
  const getDotColor = (stat: string) => {
    switch (stat) {
      case "Hot Lead":
        return "bg-accent-red";
      case "Warm Lead":
        return "bg-accent-amber";
      case "Cold Lead":
        return "bg-accent-blue";
      case "Closed":
        return "bg-accent-emerald";
      default:
        return "bg-text-muted";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-heading font-semibold tracking-wide border backdrop-blur-md transition-all duration-300",
        size === "sm"
          ? "px-2.5 py-0.5 text-[9px]"
          : "px-3 py-1 text-[10px]",
        getStatusClass(status)
      )}
    >
      {showDot && (
        <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse-slow", getDotColor(status))} />
      )}
      <span>{status}</span>
    </span>
  );
}
