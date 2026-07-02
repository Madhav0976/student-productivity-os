import React, { useState } from "react";
import { StudySession } from "../../types";
import { X, Save } from "lucide-react";
import Button from "../ui/Button";
import toast from "react-hot-toast";

interface StudyEditorProps {
  session: StudySession;
  onCancel: () => void;
  onSave: (id: string, payload: Partial<StudySession>) => Promise<void>;
}

export default function StudyEditor({ session, onCancel, onSave }: StudyEditorProps) {
  const [subject, setSubject] = useState(session.subject);
  const [topic, setTopic] = useState(session.topic || "");
  const [duration, setDuration] = useState(session.duration.toString());
  const [sessionDate, setSessionDate] = useState(session.sessionDate.split("T")[0]);
  const [notes, setNotes] = useState(session.notes || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!subject.trim()) { toast.error("Subject is required"); return; }
    const numDuration = parseInt(duration, 10);
    if (isNaN(numDuration) || numDuration <= 0) { toast.error("Valid duration is required"); return; }
    setSaving(true);
    try {
      await onSave(session._id, { subject: subject.trim(), topic, duration: numDuration, sessionDate, notes });
      toast.success("Session saved");
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
        <Button variant="primary" onClick={handleSave} disabled={saving} className="gap-2 bg-emerald-600 hover:bg-emerald-700 border-emerald-600">
          <Save size={16} /> {saving ? "Saving..." : "Save Session"}
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-8 shadow-sm space-y-6">
        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Subject</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-transparent border-b border-slate-200 dark:border-slate-800 outline-none text-3xl font-bold text-slate-900 dark:text-white pb-2 focus:border-emerald-500 transition-colors placeholder:text-slate-300 dark:placeholder:text-slate-700"
            placeholder="Subject Name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Topic (Optional)</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="inp text-sm w-full"
              placeholder="e.g. Thermodynamics"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="inp text-sm w-full"
              min={1}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Date</label>
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="inp text-sm w-full"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-base text-slate-700 dark:text-slate-300 resize-y min-h-[250px] p-4 font-sans leading-relaxed placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            placeholder="Key takeaways, formulas, or summaries..."
          />
        </div>
      </div>
    </div>
  );
}
