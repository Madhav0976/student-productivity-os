import React, { useState, useRef, useEffect } from "react";
import { Plus, Tag, Globe, Calendar, AlignLeft, Code2 } from "lucide-react";
import Button from "../ui/Button";
import { CodingProblem, Difficulty, Platform } from "../../types";

interface CodingQuickLogProps {
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onAdd: (problem: Partial<CodingProblem>) => Promise<any>;
}

const today = () => new Date().toISOString().slice(0, 10);

export default function CodingQuickLog({
  isExpanded,
  onExpand,
  onCollapse,
  onAdd,
}: CodingQuickLogProps) {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState<Platform>("LeetCode");
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("");
  const [solvedDate, setSolvedDate] = useState(today());
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded) titleRef.current?.focus();
  }, [isExpanded]);

  const reset = () => {
    setTitle(""); setTopic(""); setLanguage(""); setSolvedDate(today()); 
    setNotes(""); setShowNotes(false);
    onCollapse();
  };

  const submit = async () => {
    if (!title.trim() || !topic.trim()) return;
    await onAdd({ title: title.trim(), platform, difficulty, topic: topic.trim(), language: language.trim(), solvedDate, notes: notes.trim() });
    reset();
  };

  if (!isExpanded) {
    return (
      <button
        onClick={onExpand}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/5 transition-all duration-200 text-sm group border-b border-[var(--border)]"
      >
        <Plus size={16} className="text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform" />
        <span className="font-medium">Log solved problem</span>
        <span className="ml-auto text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-sans">N</kbd>
        </span>
      </button>
    );
  }

  const getDiffColor = (d: string) => {
    if (d === "Easy") return "text-emerald-500 dark:text-emerald-400";
    if (d === "Medium") return "text-amber-500 dark:text-amber-400";
    return "text-red-500 dark:text-red-400";
  };

  return (
    <div className="p-4 border-b border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/40 animate-fade-in">
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Problem name"
            className="inp text-sm font-medium col-span-2 md:col-span-2"
            onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") reset(); }}
          />
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 rounded-lg px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 focus-within:ring-2 ring-blue-500/20 col-span-1">
            <Globe size={14} className="text-slate-400" />
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="bg-transparent border-none text-xs text-slate-700 dark:text-slate-300 outline-none font-medium pr-4 w-full cursor-pointer"
            >
              <option value="LeetCode">LeetCode</option>
              <option value="HackerRank">HackerRank</option>
              <option value="Codeforces">Codeforces</option>
              <option value="GeeksForGeeks">GeeksForGeeks</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 rounded-lg px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 focus-within:ring-2 ring-blue-500/20 col-span-1">
            <Tag size={14} className="text-slate-400" />
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className={`bg-transparent border-none text-xs outline-none font-medium pr-4 w-full cursor-pointer ${getDiffColor(difficulty)}`}
            >
              <option value="Easy" className="text-emerald-500">Easy</option>
              <option value="Medium" className="text-amber-500">Medium</option>
              <option value="Hard" className="text-red-500">Hard</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic (e.g., Arrays, DP)"
            className="inp text-sm"
            onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") reset(); }}
          />
          <input
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="Language (e.g., Python, C++)"
            className="inp text-sm"
            onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") reset(); }}
          />
        </div>

        {showNotes && (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes on approach or logic..."
            className="inp resize-none min-h-[60px] text-sm"
            onKeyDown={(e) => { if (e.key === "Escape") reset(); }}
          />
        )}

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white dark:bg-black/20 rounded-lg px-2.5 py-1.5 border border-slate-200 dark:border-white/5">
              <Calendar size={13} className="text-slate-500 dark:text-slate-400" />
              <input
                type="date"
                value={solvedDate}
                onChange={(e) => setSolvedDate(e.target.value)}
                className="bg-transparent border-none text-xs text-slate-700 dark:text-slate-300 outline-none font-medium cursor-pointer"
              />
            </div>
            <button
              onClick={() => setShowNotes((v) => !v)}
              className={`flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg transition-colors ${
                showNotes ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <AlignLeft size={13} /> Notes
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={reset} className="text-slate-500">Cancel</Button>
            <Button variant="primary" size="sm" onClick={submit} disabled={!title.trim() || !topic.trim()} className="bg-blue-600 hover:bg-blue-700 border-blue-600">
              Save Problem
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
