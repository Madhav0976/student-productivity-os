import React from "react";
import { BookOpen, CheckSquare, Code2, Target, FileText, Briefcase, BarChart3, Calendar, Inbox } from "lucide-react";
import { cn } from "../../utils/cn";
import Button from "./Button";

type ActionObj = { label: string; onClick: () => void };

interface EmptyStateProps {
  type?: "tasks" | "notes" | "goals" | "coding" | "placements" | "study" | "analytics" | "calendar" | "inbox" | "search" | "generic";
  title?: string;
  description?: string;
  action?: React.ReactNode | ActionObj;
  className?: string;
}

const CONFIGS = {
  tasks: {
    icon: CheckSquare,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    title: "No tasks yet",
    desc: "Create your first task to start tracking your work.",
  },
  notes: {
    icon: FileText,
    color: "text-slate-400",
    bg: "bg-slate-400/10",
    title: "Your notes will appear here",
    desc: "Capture thoughts, lecture notes, or anything worth remembering.",
  },
  goals: {
    icon: Target,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    title: "Set your first goal",
    desc: "Define what you want to achieve and track your progress.",
  },
  coding: {
    icon: Code2,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    title: "Start your coding journey",
    desc: "Log problems you solve to track your progress and streak.",
  },
  placements: {
    icon: Briefcase,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    title: "Track your applications",
    desc: "Add companies you've applied to and move them through your pipeline.",
  },
  study: {
    icon: BookOpen,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    title: "Plan your study sessions",
    desc: "Log sessions by subject to track your study hours.",
  },
  analytics: {
    icon: BarChart3,
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
    title: "No data yet",
    desc: "Complete tasks, study, and code to unlock your analytics dashboard.",
  },
  calendar: {
    icon: Calendar,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    title: "Your calendar is clear",
    desc: "Add tasks, study sessions, or placement events to see them here.",
  },
  inbox: {
    icon: Inbox,
    color: "text-slate-400",
    bg: "bg-slate-400/10",
    title: "All caught up!",
    desc: "No new notifications or items need your attention.",
  },
  search: {
    icon: CheckSquare,
    color: "text-slate-400",
    bg: "bg-slate-400/10",
    title: "No results found",
    desc: "Try adjusting your search or filters.",
  },
  generic: {
    icon: CheckSquare,
    color: "text-slate-400",
    bg: "bg-slate-400/10",
    title: "Nothing here yet",
    desc: "Get started by adding something.",
  },
};

const isActionObj = (act: any): act is ActionObj => {
  return typeof act === 'object' && act !== null && !React.isValidElement(act) && 'label' in act && 'onClick' in act;
};

export default function EmptyState({ type = "generic", title, description, action, className }: EmptyStateProps) {
  const config = CONFIGS[type];
  const Icon = config.icon;

  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      {/* Illustration */}
      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-5 relative", config.bg)}>
        <Icon size={28} className={config.color} />
        {/* Decorative rings */}
        <div className={cn("absolute inset-0 rounded-2xl border-2 opacity-50 scale-125", config.bg)} />
        <div className={cn("absolute inset-0 rounded-2xl border opacity-30 scale-150", config.bg)} />
      </div>

      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">{title || config.title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-6 leading-relaxed">{description || config.desc}</p>

      {action && (
        <div>
          {isActionObj(action) ? (
            <Button onClick={action.onClick}>
              {action.label}
            </Button>
          ) : (
            <>{action}</>
          )}
        </div>
      )}
    </div>
  );
}