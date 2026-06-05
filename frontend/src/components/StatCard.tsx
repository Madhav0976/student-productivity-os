import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
}

export default function StatCard({ title, value, detail, icon: Icon }: StatCardProps) {
  return (
    <div className="panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{detail}</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-md bg-blue-50 text-brand dark:bg-blue-950">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
