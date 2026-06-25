import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: { value: number; label: string };
  sublabel?: string;
  className?: string;
  onClick?: () => void;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = "text-brand-400",
  trend,
  sublabel,
  className = "",
  onClick,
}: StatCardProps) {
  return (
    <div
      className={`card p-4 flex flex-col gap-3 animate-fade-in ${onClick ? "cursor-pointer hover:border-brand-600/30 transition-all" : ""} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        {Icon && (
          <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
            <Icon size={14} className={iconColor} />
          </div>
        )}
      </div>
      
      <div>
        <p className="text-2xl font-bold text-white leading-none animate-count-up">{value}</p>
        {sublabel && <p className="text-xs text-slate-500 mt-1">{sublabel}</p>}
      </div>

      {trend && (
        <div className="flex items-center gap-1">
          <span className={`text-xs font-medium ${trend.value >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
          <span className="text-2xs text-slate-600">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
