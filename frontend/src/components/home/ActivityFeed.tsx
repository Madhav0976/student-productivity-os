import React from 'react';
import { Activity, CheckSquare, FileText, Code2, BookOpen, Briefcase, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatRelative } from '../../utils/dates';
import { SkeletonRow } from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';

export interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  type: 'task' | 'note' | 'coding' | 'study' | 'placement' | 'goal';
}

interface ActivityFeedProps {
  loading: boolean;
  activities: ActivityItem[];
}

export default function ActivityFeed({ loading, activities }: ActivityFeedProps) {
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch(type) {
      case 'task': return <CheckSquare size={14} className="text-blue-500" />;
      case 'note': return <FileText size={14} className="text-slate-500" />;
      case 'coding': return <Code2 size={14} className="text-amber-500" />;
      case 'study': return <BookOpen size={14} className="text-emerald-500" />;
      case 'placement': return <Briefcase size={14} className="text-pink-500" />;
      case 'goal': return <Target size={14} className="text-purple-500" />;
      default: return <Activity size={14} className="text-brand-500" />;
    }
  };

  const getActionText = (type: string) => {
    switch(type) {
      case 'task': return 'Completed task';
      case 'note': return 'Created note';
      case 'coding': return 'Solved problem';
      case 'study': return 'Logged study session';
      case 'placement': return 'Updated application';
      case 'goal': return 'Made progress on goal';
      default: return 'Activity';
    }
  };

  const getTargetRoute = (type: string) => {
    switch(type) {
      case 'task': return '/tasks';
      case 'note': return '/notes';
      case 'coding': return '/coding';
      case 'study': return '/study';
      case 'placement': return '/placements';
      case 'goal': return '/goals';
      default: return '/';
    }
  };

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-5">
        <Activity size={16} className="text-brand-500" />
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : activities.length === 0 ? (
        <EmptyState 
          type="generic" 
          title="No recent activity" 
          description="Your latest logs and actions will appear here."
          className="py-6 px-2"
        />
      ) : (
        <div className="space-y-2">
          {activities.slice(0, 5).map((act) => (
            <button 
              key={act.id} 
              onClick={() => navigate(getTargetRoute(act.type))}
              className="w-full text-left flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                {getIcon(act.type)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-900 dark:text-slate-200 truncate group-hover:text-brand-500 transition-colors">
                  <span className="font-medium">{getActionText(act.type)}:</span> {act.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{formatRelative(act.timestamp)}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
