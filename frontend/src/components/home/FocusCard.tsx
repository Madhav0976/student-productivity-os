import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, ArrowRight, AlertCircle, Clock } from 'lucide-react';
import { Task } from '../../types';
import { isOverdue, formatDateShort } from '../../utils/dates';
import { SkeletonRow } from '../ui/Skeleton';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';

interface FocusCardProps {
  loading: boolean;
  upcomingTasks: Task[];
  overdueTasks: Task[];
  todayTasks: Task[];
}

export default function FocusCard({ loading, upcomingTasks, overdueTasks, todayTasks }: FocusCardProps) {
  const navigate = useNavigate();

  const items = [
    ...overdueTasks.map(t => ({ ...t, isOverdue: true })),
    ...todayTasks.filter(t => !isOverdue(t.dueDate) && t.status !== "Completed")
  ].slice(0, 5);

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Target size={15} className="text-brand-500" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Today's Focus</h2>
        </div>
        <button onClick={() => navigate("/tasks")} className="text-2xs text-slate-500 hover:text-brand-400 flex items-center gap-1 transition-colors">
          View all <ArrowRight size={11} />
        </button>
      </div>

      {loading ? (
        <div className="py-2">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState 
          type="tasks" 
          title="Schedule is clear" 
          description="Enjoy your day or add a task to get started." 
          className="py-10"
        />
      ) : (
        <div className="py-1">
          {items.map((task) => (
            <button
              key={task._id}
              onClick={() => navigate("/tasks")}
              className="task-row w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-all duration-150 text-left group border-b border-[var(--border)] last:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:relative"
            >
              <div className="flex-shrink-0">
                {(task as any).isOverdue ? (
                  <AlertCircle size={14} className="text-red-500" />
                ) : (
                  <Clock size={14} className="text-brand-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${(task as any).isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-slate-900 dark:text-slate-200'}`}>
                  {task.title}
                </p>
                <p className="text-2xs text-slate-500 flex items-center gap-1 mt-0.5">
                  {formatDateShort(task.dueDate)}
                </p>
              </div>
              <div className="flex-shrink-0">
                <Badge variant="priority" value={task.priority} label={task.priority} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
