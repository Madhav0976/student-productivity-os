import React from 'react';
import { BarChart3, CheckSquare, Target, Code2, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SkeletonRow } from '../ui/Skeleton';

interface ProgressCardProps {
  loading: boolean;
  taskProgress: number; // 0-100
  studyProgress: number; // 0-100
  codingProgress: number; // 0-100
  goalProgress: number; // 0-100
}

export default function ProgressCard({ loading, taskProgress, studyProgress, codingProgress, goalProgress }: ProgressCardProps) {
  const navigate = useNavigate();

  const items = [
    { label: 'Tasks Completed', progress: taskProgress, icon: CheckSquare, color: 'bg-blue-500', iconColor: 'text-blue-500', to: '/tasks' },
    { label: 'Study Goal', progress: studyProgress, icon: BookOpen, color: 'bg-emerald-500', iconColor: 'text-emerald-500', to: '/study' },
    { label: 'Coding Daily Target', progress: codingProgress, icon: Code2, color: 'bg-amber-500', iconColor: 'text-amber-500', to: '/coding' },
    { label: 'Goals Track', progress: goalProgress, icon: Target, color: 'bg-purple-500', iconColor: 'text-purple-500', to: '/goals' },
  ];

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 size={16} className="text-brand-500" />
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Daily Progress</h2>
      </div>
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : (
        <div className="space-y-5">
          {items.map((item, idx) => (
            <button 
              key={idx} 
              className="w-full text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg p-1 -m-1"
              onClick={() => navigate(item.to)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <item.icon size={14} className={item.iconColor} />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-brand-500 transition-colors">{item.label}</span>
                </div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white">{Math.round(item.progress)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${Math.max(0, Math.min(100, item.progress))}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
