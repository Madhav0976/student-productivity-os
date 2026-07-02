import React, { useState } from "react";
import Drawer from "../shared/Drawer";
import Button from "../ui/Button";
import { CodingProblem, Difficulty, Platform } from "../../types";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface CodingDrawerProps {
  problem: CodingProblem;
  onClose: () => void;
  onUpdate: (id: string, payload: Partial<CodingProblem>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function CodingDrawer({ problem, onClose, onUpdate, onDelete }: CodingDrawerProps) {
  const [title, setTitle] = useState(problem.title);
  const [platform, setPlatform] = useState(problem.platform);
  const [difficulty, setDifficulty] = useState(problem.difficulty);
  const [topic, setTopic] = useState(problem.topic);
  const [language, setLanguage] = useState(problem.language || "");
  const [solvedDate, setSolvedDate] = useState(problem.solvedDate?.split("T")[0] || "");
  const [notes, setNotes] = useState(problem.notes || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!title.trim() || !topic.trim()) { toast.error("Title and topic are required"); return; }
    setSaving(true);
    try {
      await onUpdate(problem._id, { title, platform, difficulty, topic, language, notes, solvedDate });
      toast.success("Problem updated");
      onClose();
    } catch {
      toast.error("Failed to update");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this problem?")) return;
    try {
      await onDelete(problem._id);
      toast.success("Problem deleted");
      onClose();
    } catch {
      toast.error("Failed to delete problem");
    }
  };

  const footer = (
    <div className="flex items-center justify-between w-full">
      <button
        onClick={handleDelete}
        className="flex items-center justify-center w-9 h-9 rounded-xl text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
        title="Delete Problem"
      >
        <Trash2 size={17} />
      </button>
      <div className="flex items-center gap-2.5">
        <Button variant="ghost" onClick={onClose} className="text-slate-500 font-medium">Cancel</Button>
        <Button variant="primary" onClick={save} disabled={saving} className="bg-blue-600 hover:bg-blue-700 border-blue-600">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );

  return (
    <Drawer open onClose={onClose} title="Edit Problem" footer={footer}>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="inp font-medium"
            onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") onClose(); }}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="inp text-sm"
            >
              <option value="LeetCode">LeetCode</option>
              <option value="HackerRank">HackerRank</option>
              <option value="Codeforces">Codeforces</option>
              <option value="GeeksForGeeks">GeeksForGeeks</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="inp text-sm"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="inp text-sm"
              onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") onClose(); }}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">Language</label>
            <input
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="inp text-sm"
              onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") onClose(); }}
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">Solved Date</label>
          <input
            type="date"
            value={solvedDate}
            onChange={(e) => setSolvedDate(e.target.value)}
            className="inp text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="inp resize-none min-h-[100px] text-sm"
            placeholder="Approach, time complexity, space complexity..."
          />
        </div>
      </div>
    </Drawer>
  );
}
