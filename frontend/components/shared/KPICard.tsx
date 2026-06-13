"use client";

import React from "react";
import AnimatedCounter from "./AnimatedCounter";
import SparkLine from "./SparkLine";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  change: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color: string;
  delay?: number;
  sparklineData?: number[];
}

export default function KPICard({
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  change,
  changeLabel,
  icon,
  color,
  delay = 0,
  sparklineData,
}: KPICardProps) {
  const isPositive = change >= 0;

  return (
    <div
      className="bg-surface border border-border-default hover:border-border-medium rounded-xl p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-200 cursor-default"
      style={{
        animationDelay: `${delay}ms`,
        animation: "slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        opacity: 0,
      }}
    >
      
      <div className="flex items-start justify-between z-10">
        <div
          className="p-2.5 rounded-xl border flex items-center justify-center transition-colors duration-300"
          style={{
            backgroundColor: `${color}10`,
            borderColor: `${color}25`,
            color: color,
          }}
        >
          {icon}
        </div>
        <div
          className={`flex items-center gap-1 text-[10px] font-heading font-semibold px-2 py-0.5 rounded-full border ${
            isPositive
              ? "text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20"
              : "text-accent-red bg-accent-red/10 border-accent-red/20"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3 text-accent-emerald" />
          ) : (
            <TrendingDown className="w-3 h-3 text-accent-red" />
          )}
          {Math.abs(change)}%
        </div>
      </div>

      <div className="flex items-end justify-between mt-4 z-10">
        <div className="space-y-1">
          <div className="text-2xl font-heading font-bold text-text-primary tracking-tight">
            <AnimatedCounter end={value} prefix={prefix} suffix={suffix} decimals={decimals} />
          </div>
          <div className="text-[11px] font-medium text-text-secondary tracking-wide uppercase">
            {label}
          </div>
          {changeLabel && (
            <div className="text-[10px] font-mono text-text-muted">
              {changeLabel}
            </div>
          )}
        </div>

        {/* Sparkline trend representation */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="w-24 h-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
            <SparkLine
              data={sparklineData}
              strokeColor={color}
              width={96}
              height={40}
              fillGradient={[`${color}20`, "transparent"]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
