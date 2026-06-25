import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps {
    label: string;
    variant?: 'priority' | 'status' | 'difficulty' | 'placement' | 'custom';
    value?: string;
    size?: 'sm' | 'md';
    icon?: React.ReactNode;
    className?: string;
}

const getStyles = (variant: NonNullable<BadgeProps["variant"]>, value: string) => {
    const normalized = value
        ?.toLowerCase()
        .replace(/\s+/g, "_");

    const styles: Record<string, string> = {
        priority_high: "bg-red-50 text-red-700 border-red-200",
        priority_medium: "bg-amber-50 text-amber-700 border-amber-200",
        priority_low: "bg-emerald-50 text-emerald-700 border-emerald-200",
        status_completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
        status_pending: "bg-amber-50 text-amber-700 border-amber-200",
        status_in_progress: "bg-blue-50 text-blue-700 border-blue-200",
        difficulty_easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
        difficulty_medium: "bg-amber-50 text-amber-700 border-amber-200",
        difficulty_hard: "bg-red-50 text-red-700 border-red-200",
        placement_applied: "bg-blue-50 text-blue-700 border-blue-200",
        placement_oa: "bg-cyan-50 text-cyan-700 border-cyan-200",
        placement_interview: "bg-purple-50 text-purple-700 border-purple-200",
        placement_hr: "bg-orange-50 text-orange-700 border-orange-200",
        placement_offer: "bg-emerald-50 text-emerald-700 border-emerald-200",
        placement_rejected: "bg-red-50 text-red-700 border-red-200",
    };

    return styles[`${variant}_${normalized}`] || "bg-slate-50 text-slate-700 border-slate-200";
};

export const Badge: React.FC<BadgeProps> = ({
    label,
    variant = 'custom',
    value = '',
    size = 'md',
    icon,
    className,
}) => {
    const sizeStyles = {
        sm: "px-1.5 py-0 text-[10px]",
        md: "px-2.5 py-0.5 text-xs",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 font-medium rounded-full border transition-colors",
                sizeStyles[size],
                variant !== 'custom' ? getStyles(variant, value) : "bg-slate-100 text-slate-700 border-slate-200",
                className
            )}
        >
            {icon && <span className="shrink-0">{icon}</span>}
            {label}
        </span>
    );
};

export default Badge;