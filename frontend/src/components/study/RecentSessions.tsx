import React from "react";
import { StudySession } from "../../types";
import { Clock } from "lucide-react";

interface RecentSessionsProps {
  sessions: StudySession[];
  onClick: (session: StudySession) => void;
}

export default function RecentSessions({ sessions, onClick }: RecentSessionsProps) {
  if (sessions.length === 0) return null;

  return (
    <div className="space-y-3">
      {sessions.slice(0, 10).map((session) => (
        <div
          key={session._id}
          onClick={() => onClick(session)}
          className="p-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:border-emerald-300 transition-colors flex flex-col gap-2"
        >
          <div className="flex justify-between items-start gap-2">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {session.subject} {session.topic && <span className="font-normal text-slate-500">— {session.topic}</span>}
            </h4>
            <span className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md flex-shrink-0">
              <Clock size={12} />
              {session.duration >= 60 ? `${(session.duration / 60).toFixed(1)}h` : `${session.duration}m`}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span className="truncate max-w-[70%]">{session.notes || "No notes"}</span>
            <span className="flex-shrink-0">
              {new Date(session.sessionDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
