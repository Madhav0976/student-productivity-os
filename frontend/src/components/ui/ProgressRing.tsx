import React from "react";

interface ProgressRingProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0-100
  color?: string;
  trackColor?: string;
  label?: string;
  sublabel?: string;
  showPercent?: boolean;
  animate?: boolean;
}

export default function ProgressRing({
  size = 80,
  strokeWidth = 6,
  progress,
  color = "#7C3AED",
  trackColor = "rgba(255,255,255,0.05)",
  label,
  sublabel,
  showPercent = true,
  animate = true,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          role="img"
          aria-label={`${progress}% complete`}
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
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
            className={animate ? "progress-ring-circle" : ""}
            style={{ transition: animate ? "stroke-dashoffset 0.8s ease-in-out" : undefined }}
          />
        </svg>
        {showPercent && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-bold text-white leading-none">{Math.round(progress)}%</span>
          </div>
        )}
      </div>
      {label && <p className="text-xs font-medium text-white text-center">{label}</p>}
      {sublabel && <p className="text-2xs text-slate-500 text-center">{sublabel}</p>}
    </div>
  );
}
