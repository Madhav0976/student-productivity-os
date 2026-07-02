import React, { useState, useRef, useEffect } from "react";
import { Plus, Clock, BookOpen, Calendar, AlignLeft } from "lucide-react";
import Button from "../ui/Button";
import { StudySession } from "../../types";

interface StudyQuickSessionProps {
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onAdd: (session: Partial<StudySession>) => Promise<any>;
}

const today = () => new Date().toISOString().slice(0, 10);

export default function StudyQuickSession({
  isExpanded,
  onExpand,
  onCollapse,
  onAdd,
}: StudyQuickSessionProps) {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState(60);
  const [sessionDate, setSessionDate] = useState(today());
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const subjectRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded) subjectRef.current?.focus();
  }, [isExpanded]);

  const reset = () => {
    setSubject(""); setTopic(""); setDuration(60);
    setSessionDate(today()); setNotes(""); setShowNotes(false);
    onCollapse();
  };

  const submit = async () => {
    if (!subject.trim()) return;
    await onAdd({ subject: subject.trim(), topic: topic.trim(), duration, sessionDate, notes: notes.trim(), completed: false });
    reset();
  };

  if (!isExpanded) {
    return (
      <button
        onClick={onExpand}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/5 transition-all duration-200 text-sm group border-b border-[var(--border)]"
      >
        <Plus size={16} className="text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
        <span className="font-medium">Log study session</span>
        <span className="ml-auto text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-sans">N</kbd>
        </span>
      </button>
    );
  }

  return (
    <div className="p-4 border-b border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/40 animate-fade-in">
      <div className="flex flex-col gap-3">
        {/* Subject + Topic row */}
        <div className="grid grid-cols-2 gap-2">
          <input
            ref={subjectRef}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject (e.g., Maths)"
            className="inp text-sm font-medium"
            onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") reset(); }}
          />
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic (optional)"
            className="inp text-sm"
            onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") reset(); }}
          />
        </div>

        {/* Notes (optional) */}
        {showNotes && (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Session notes..."
            className="inp resize-none min-h-[60px] text-sm"
            onKeyDown={(e) => { if (e.key === "Escape") reset(); }}
          />
        )}

        {/* Controls row */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {/* Duration */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-black/20 rounded-lg px-2.5 py-1.5 border border-slate-200 dark:border-white/5">
              <Clock size={13} className="text-slate-500 dark:text-slate-400" />
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="bg-transparent border-none text-xs text-slate-700 dark:text-slate-300 outline-none font-medium pr-4 cursor-pointer appearance-none"
              >
                {[30, 45, 60, 90, 120, 150, 180].map((m) => (
                  <option key={m} value={m} className="bg-white dark:bg-slate-800">
                    {m >= 60 ? `${m / 60}h${m % 60 ? ` ${m % 60}m` : ""}` : `${m}m`}
                  </option>
                ))}
              </select>
            </div>
            {/* Date */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-black/20 rounded-lg px-2.5 py-1.5 border border-slate-200 dark:border-white/5">
              <Calendar size={13} className="text-slate-500 dark:text-slate-400" />
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="bg-transparent border-none text-xs text-slate-700 dark:text-slate-300 outline-none font-medium cursor-pointer"
              />
            </div>
            {/* Notes toggle */}
            <button
              onClick={() => setShowNotes((v) => !v)}
              className={`flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg transition-colors ${
                showNotes ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <AlignLeft size={13} /> Notes
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={reset} className="text-slate-500">Cancel</Button>
            <Button variant="primary" size="sm" onClick={submit} disabled={!subject.trim()} className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600">
              Save Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
