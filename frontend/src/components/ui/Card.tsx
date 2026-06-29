import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'ghost';
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  action,
  className,
  variant = 'default',
}) => {
  const hasHeader = title || subtitle || action;

  const variants: Record<NonNullable<CardProps['variant']>, string> = {
    default: 'bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm',
    outlined: 'bg-transparent border border-slate-200 dark:border-slate-800',
    ghost: 'bg-transparent border-0 shadow-none',
  };

  // Check if custom padding is explicitly provided in className
  const hasCustomPadding = className
    ? /\bp-\d|\bpx-\d|\bpy-\d|\bp-\[|\bpx-\[|\bpy-\[/.test(className)
    : false;

  return (
    <div
      className={cn(
        'rounded-xl transition-all duration-200',
        variants[variant],
        className
      )}
    >
      {hasHeader && (
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            {title && (
              <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className={hasCustomPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};

export default Card;