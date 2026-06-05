interface ProgressBarProps {
  value: number;
}

export default function ProgressBar({ value }: ProgressBarProps) {
  const bounded = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
      <div className="h-2 rounded-full bg-mint transition-all" style={{ width: `${bounded}%` }} />
    </div>
  );
}
