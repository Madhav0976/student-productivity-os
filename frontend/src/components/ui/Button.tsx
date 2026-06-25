import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
    primary:
        "bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600",

    secondary:
        "bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200",

    outline:
        "bg-transparent border border-slate-300 hover:bg-slate-100 text-slate-900",

    ghost:
        "bg-transparent hover:bg-slate-100 text-slate-700",

    danger:
        "bg-red-600 hover:bg-red-700 text-white border border-red-600",
};

const sizeClasses: Record<Size, string> = {
    sm: "h-9 px-3 text-sm",

    md: "h-11 px-5 text-sm",

    lg: "h-12 px-6 text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            loading = false,
            className,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={clsx(
                    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-400",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    variantClasses[variant],
                    sizeClasses[size],
                    className
                )}
                {...props}
            >
                {loading ? "Loading..." : children}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;