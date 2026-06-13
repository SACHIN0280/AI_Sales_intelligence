"use client";

import React, { useId } from "react";

interface SparkLineProps {
  data: number[];
  width?: string | number;
  height?: string | number;
  strokeColor?: string;
  strokeWidth?: number;
  fillGradient?: string[];
  animated?: boolean;
}

export default function SparkLine({
  data = [10, 15, 8, 22, 18, 25, 30, 22, 40],
  width = "100%",
  height = 40,
  strokeColor = "var(--primary)",
  strokeWidth = 2,
  fillGradient = ["rgba(99, 102, 241, 0.2)", "rgba(99, 102, 241, 0)"],
  animated = true,
}: SparkLineProps) {
  const gradientId = useId();

  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;

  const widthVal = typeof width === "number" ? width : 120;
  const heightVal = typeof height === "number" ? height : 40;

  // Generate points
  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * widthVal;
    // Invert y because SVG coordinates start from top
    const y = heightVal - 4 - ((val - min) / range) * (heightVal - 8);
    return { x, y };
  });

  const pathD = points.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );

  const fillD = `${pathD} L ${points[points.length - 1].x} ${heightVal} L ${points[0].x} ${heightVal} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${widthVal} ${heightVal}`}
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillGradient[0] || strokeColor} stopOpacity={0.25} />
          <stop offset="100%" stopColor={fillGradient[1] || "transparent"} stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* Fill Area */}
      <path d={fillD} fill={`url(#${gradientId})`} />
      {/* Stroke Line */}
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? "animate-draw" : ""}
        style={{
          strokeDasharray: animated ? 500 : undefined,
          strokeDashoffset: animated ? 500 : undefined,
          animation: animated ? "draw-line 2s cubic-bezier(0.4, 0, 0.2, 1) forwards" : undefined,
        }}
      />
      {/* Endpoint Indicator Dot */}
      {points.length > 0 && (
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r={3}
          fill={strokeColor}
          className="animate-pulse"
          style={{ transformOrigin: `${points[points.length - 1].x}px ${points[points.length - 1].y}px` }}
        />
      )}
    </svg>
  );
}
