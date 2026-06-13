"use client";

import React, { useId } from "react";
import { getScoreColor } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showGrade?: boolean;
}

export default function ScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
  label,
  showGrade = true,
}: ScoreRingProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);
  const glowId = useId();

  // Get Letter Grade
  const getGrade = (s: number) => {
    if (s >= 90) return "A+";
    if (s >= 80) return "A";
    if (s >= 70) return "B";
    if (s >= 50) return "C";
    return "D";
  };

  return (
    <div className="flex flex-col items-center gap-1.5 select-none">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Minimal Score Ring */}

        <svg width={size} height={size} className="overflow-visible">
          {/* SVG Definitions Removed */}
          
          {/* Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth={strokeWidth}
          />
          
          {/* Animated Indicator Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 1s ease",
              transform: "rotate(-90deg)",
              transformOrigin: "center",
            }}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-baseline justify-center">
            <span
              className="text-2xl font-heading font-extrabold tracking-tighter"
              style={{ color }}
            >
              {score}
            </span>
            <span className="text-[10px] text-text-muted ml-0.5">/100</span>
          </div>
          {showGrade && (
            <span
              className="text-[9px] font-heading font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md mt-0.5 border"
              style={{
                color: color,
                backgroundColor: `${color}12`,
                borderColor: `${color}25`,
              }}
            >
              Grade {getGrade(score)}
            </span>
          )}
        </div>
      </div>
      {label && (
        <span className="text-[11px] font-heading font-medium tracking-wide text-text-secondary">
          {label}
        </span>
      )}
    </div>
  );
}
