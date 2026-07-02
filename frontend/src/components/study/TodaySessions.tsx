import React from "react";
import { StudySession } from "../../types";
import { Clock, CheckCircle2, Circle, MoreHorizontal } from "lucide-react";

interface TodaySessionsProps {
  sessions: StudySession[];
  onToggleComplete: (id: string) => void;
  onClick: (session: StudySession) => void;
}

export default function TodaySessions({ sessions, onToggleComplete, onClick }: TodaySessionsProps) {
  // Group by Morning, Afternoon, Evening based on createdAt (or assume all morning if undefined)
  const getGroup = (dateStr?: string) => {
    if (!dateStr) return "Morning";
    const hour = new Date(dateStr).getHours();
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    return "Evening";
  };

  const groups = sessions.reduce((acc, session) => {
    const group = getGroup(session.createdAt);
    if (!acc[group]) acc[group] = [];
    acc[group].push(session);
    return acc;
  }, {} as Record<string, StudySession[]>);

  if (sessions.length === 0) return null;

  return (
    <div className="space-y-6">
      {(["Morning", "Afternoon", "Evening"] as const).map((period) => {
        const periodSessions = groups[period];
        if (!periodSessions || periodSessions.length === 0) return null;

        return (
          <div key={period} className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{period}</h4>
            <div className="grid gap-2">
              {periodSessions.map((session) => (
                <div
                  key={session._id}
                  onClick={() => onClick(session)}
                  className="flex items-center justify-between p-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleComplete(session._id);
                      }}
                      className="flex-shrink-0 text-slate-400 hover:text-emerald-500 transition-colors"
                    >
                      {session.completed ? (
                        <CheckCircle2 size={18} className="text-emerald-500" />
                      ) : (
                        <Circle size={18} />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${session.completed ? "text-slate-500 line-through" : "text-slate-900 dark:text-white"}`}>
                        {session.subject} {session.topic && <span className="text-slate-400 font-normal ml-1">— {session.topic}</span>}
                      </p>
                      {session.notes && (
                        <p className="text-xs text-slate-500 truncate max-w-[200px] md:max-w-[300px]">
                          {session.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3 text-xs text-slate-500 font-medium ml-2">
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                      <Clock size={12} />
                      {session.duration >= 60 ? `${(session.duration / 60).toFixed(1)}h` : `${session.duration}m`}
                    </span>
                    <MoreHorizontal size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
