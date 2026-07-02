import React, { useId } from "react";
import { cn } from "../../utils/cn";

interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export default function Input({
    label,
    error,
    icon,
    className,
    id,
    ...props
}: InputProps) {
    const defaultId = useId();
    const inputId = id || defaultId;

    return (
        <div className="space-y-1.5">
            {label && (
                <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {icon}
                    </div>
                )}

                <input
                    id={inputId}
                    {...props}
                    className={cn(
                        "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5",
                        "text-sm outline-none transition-all",
                        "focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
                        "dark:border-slate-700 dark:bg-slate-900 dark:text-white",
                        icon && "pl-10",
                        error && "border-red-500 focus:ring-red-100",
                        className
                    )}
                />
            </div>

            {error && (
                <p className="text-xs text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}