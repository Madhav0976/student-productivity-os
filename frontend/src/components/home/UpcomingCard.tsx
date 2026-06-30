import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDateShort } from '../../utils/dates';
import { SkeletonRow } from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';

export interface UpcomingItem {
  id: string;
  title: string;
  date: string;
  type: string;
}

interface UpcomingCardProps {
  loading: boolean;
  items: UpcomingItem[];
}

export default function UpcomingCard({ loading, items }: UpcomingCardProps) {
  const navigate = useNavigate();

  const getTargetRoute = (type: string) => {
    switch (type.toLowerCase()) {
      case 'task': return '/tasks';
      case 'goal': return '/goals';
      case 'study': return '/study';
      case 'placement': return '/placements';
      default: return '/calendar';
    }
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-indigo-500" />
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Upcoming</h2>
        </div>
        <button onClick={() => navigate("/calendar")} className="text-xs text-slate-500 hover:text-brand-500 flex items-center gap-1 transition-colors">
          View all <ArrowRight size={12} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState 
          type="calendar" 
          title="No upcoming events" 
          description="Your next 7 days are completely clear."
          className="py-6 px-2"
        />
      ) : (
        <div className="space-y-3">
          {items.slice(0, 4).map((item) => (
            <button 
              key={item.id} 
              onClick={() => navigate(getTargetRoute(item.type))}
              className="w-full text-left flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-100 dark:bg-white-[0.02] dark:hover:bg-white/5 transition-colors cursor-pointer border border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{item.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.type}</p>
              </div>
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-md">
                {formatDateShort(item.date)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
