"use client";

import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number | string;
  Icon: LucideIcon;
  iconColorClass: string;
  isDark: boolean;
}

export function MetricCard({
  title,
  value,
  Icon,
  iconColorClass,
  isDark,
}: MetricCardProps) {
  return (
    <div
      className={`border p-6 rounded-2xl space-y-4 transition-colors duration-200 shadow-xs ${
        isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-sm font-medium ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
        >
          {title}
        </span>
        <Icon className={`h-5 w-5 ${iconColorClass}`} />
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
