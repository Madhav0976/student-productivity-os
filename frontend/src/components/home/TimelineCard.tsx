import React from 'react';
import { Sun, Sunset, Moon, Circle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Task, StudySession, Placement, CodingProblem } from '../../types';
import { SkeletonRow } from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';

interface TimelineCardProps {
  loading: boolean;
  tasks: Task[];
  studySessions: StudySession[];
  placements: Placement[];
  coding: CodingProblem[];
}

export default function TimelineCard({ loading, tasks, studySessions, placements, coding }: TimelineCardProps) {
  const navigate = useNavigate();

  // Distribute items logically for the timeline effect
  const morningItems = [...studySessions.slice(0, 1), ...tasks.slice(0, 1)];
  const afternoonItems = [...placements.slice(0, 1), ...coding.slice(0, 1), ...tasks.slice(1, 2)];
  const eveningItems = [...coding.slice(1, 2), ...studySessions.slice(1, 2), ...tasks.slice(2, 3)];

  const totalItems = morningItems.length + afternoonItems.length + eveningItems.length;

  const getTargetRoute = (item: any) => {
    if (item.title && item.platform) return '/coding';
    if (item.title) return '/tasks';
    if (item.subject) return '/study';
    return '/placements';
  };

  const renderBlock = (title: string, icon: React.ReactNode, items: any[], isLast: boolean) => (
    <div className={`relative pl-8 ${isLast ? '' : 'pb-6'}`}>
      {!isLast && (
        <div className="absolute left-[15px] top-8 bottom-0 w-px bg-slate-200 dark:bg-slate-700/50" />
      )}
      
      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 shadow-sm z-10">
        {icon}
      </div>
      
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 pt-1.5">{title}</h3>
      
      {items.length === 0 ? (
        <p className="text-xs text-slate-400 italic">No events scheduled.</p>
      ) : (
        <div className="space-y-2.5">
          {items.map((item, idx) => (
            <button
              key={idx} 
              onClick={() => navigate(getTargetRoute(item))}
              className="w-full text-left flex items-start gap-3 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-100 dark:bg-white-[0.02] dark:hover:bg-white/5 transition-colors border border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {item.status === 'Completed' || item.completed ? (
                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              ) : (
                <Circle size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium ${item.status === 'Completed' || item.completed ? 'text-slate-500 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                  {item.title || item.subject || item.companyName}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {item.title && item.platform ? 'Coding' : item.title ? 'Task' : item.subject ? 'Study' : 'Placement'}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="card p-5">
      <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-6">Today's Timeline</h2>
      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : totalItems === 0 ? (
        <EmptyState 
          type="calendar" 
          title="Nothing planned today" 
          description="Your timeline is empty. Try adding some study sessions or tasks!"
          className="py-10"
        />
      ) : (
        <div>
          {renderBlock("Morning (8:00 AM - 12:00 PM)", <Sun size={14} className="text-amber-500" />, morningItems, false)}
          {renderBlock("Afternoon (12:00 PM - 5:00 PM)", <Sunset size={14} className="text-orange-500" />, afternoonItems, false)}
          {renderBlock("Evening (5:00 PM - 10:00 PM)", <Moon size={14} className="text-indigo-500" />, eveningItems, true)}
        </div>
      )}
    </div>
  );
}
