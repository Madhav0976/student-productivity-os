import React, { useState } from "react";
import { CodingProblem } from "../../types";
import { X, Save } from "lucide-react";
import Button from "../ui/Button";
import toast from "react-hot-toast";

const PLATFORMS = ["LeetCode", "HackerRank", "Codeforces", "CodeChef", "Other"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const LANGUAGES = ["C++", "Java", "Python", "JavaScript", "TypeScript", "Go", "Rust", "Other"];

interface CodingEditorProps {
  problem: CodingProblem;
  onCancel: () => void;
  onSave: (id: string, payload: Partial<CodingProblem>) => Promise<void>;
}

export default function CodingEditor({ problem, onCancel, onSave }: CodingEditorProps) {
  const [title, setTitle] = useState(problem.title);
  const [platform, setPlatform] = useState(problem.platform);
  const [difficulty, setDifficulty] = useState(problem.difficulty);
  const [topic, setTopic] = useState(problem.topic);
  const [problemUrl, setProblemUrl] = useState(problem.problemUrl || "");
  const [language, setLanguage] = useState(problem.language || "C++");
  const [notes, setNotes] = useState(problem.notes || "");
  const [solvedDate, setSolvedDate] = useState(problem.solvedDate.split("T")[0]);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !topic.trim()) { toast.error("Title and topic are required"); return; }
    setSaving(true);
    try {
      await onSave(problem._id, {
        title: title.trim(), platform: platform as any, difficulty: difficulty as any, topic: topic.trim(),
        problemUrl, language, notes, solvedDate
      });
      toast.success("Problem saved");
      onCancel();
    } catch {
      toast.error("Failed to save");
    }
    setSaving(false);
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-24 flex flex-col">
      <div className="flex items-center justify-between mb-8 py-4 border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X size={18} /> Cancel Editing
        </button>
        <Button variant="primary" onClick={handleSave} disabled={saving} className="gap-2 bg-amber-500 hover:bg-amber-600 border-amber-500 text-white">
          <Save size={16} /> {saving ? "Saving..." : "Save Problem"}
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm space-y-6">
        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Problem Name</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-b border-slate-200 dark:border-slate-800 outline-none text-3xl font-bold text-slate-900 dark:text-white pb-2 focus:border-amber-500 transition-colors placeholder:text-slate-300 dark:placeholder:text-slate-700"
            placeholder="Two Sum"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Platform</label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value as any)} className="inp text-sm w-full">
              {PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)} className="inp text-sm w-full">
              {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Topic</label>
            <input value={topic} onChange={(e) => setTopic(e.target.value)} className="inp text-sm w-full" placeholder="e.g. Arrays" />
          </div>
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="inp text-sm w-full">
              {LANGUAGES.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Date Solved</label>
            <input type="date" value={solvedDate} onChange={(e) => setSolvedDate(e.target.value)} className="inp text-sm w-full" />
          </div>
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">URL (Optional)</label>
            <input value={problemUrl} onChange={(e) => setProblemUrl(e.target.value)} type="url" className="inp text-sm w-full" placeholder="https://" />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-base text-slate-700 dark:text-slate-300 resize-y min-h-[250px] p-4 font-sans leading-relaxed placeholder:text-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            placeholder="Time complexity, space complexity, approaches tried..."
          />
        </div>
      </div>
    </div>
  );
}
