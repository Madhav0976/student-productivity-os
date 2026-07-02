import React, { useState } from "react";
import Drawer from "../shared/Drawer";
import Button from "../ui/Button";
import { StudySession } from "../../types";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface StudyDrawerProps {
  session: StudySession;
  onClose: () => void;
  onUpdate: (id: string, payload: Partial<StudySession>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function StudyDrawer({ session, onClose, onUpdate, onDelete }: StudyDrawerProps) {
  const [subject, setSubject] = useState(session.subject);
  const [topic, setTopic] = useState(session.topic || "");
  const [duration, setDuration] = useState(session.duration);
  const [notes, setNotes] = useState(session.notes || "");
  const [sessionDate, setSessionDate] = useState(session.sessionDate?.split("T")[0] || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!subject.trim()) { toast.error("Subject is required"); return; }
    setSaving(true);
    try {
      await onUpdate(session._id, { subject, topic, duration, notes, sessionDate });
      toast.success("Session updated");
      onClose();
    } catch {
      toast.error("Failed to update");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this session?")) return;
    try {
      await onDelete(session._id);
      toast.success("Session deleted");
      onClose();
    } catch {
      toast.error("Failed to delete session");
    }
  };

  const footer = (
    <div className="flex items-center justify-between w-full">
      <button
        onClick={handleDelete}
        className="flex items-center justify-center w-9 h-9 rounded-xl text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
        title="Delete Session"
      >
        <Trash2 size={17} />
      </button>
      <div className="flex items-center gap-2.5">
        <Button variant="ghost" onClick={onClose} className="text-slate-500 font-medium">
          Cancel
        </Button>
        <Button variant="primary" onClick={save} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );

  return (
    <Drawer open onClose={onClose} title="Edit Session" footer={footer}>
      <div className="space-y-4">
        {/* Subject & Topic */}
        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">Subject</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="inp font-medium"
            onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") onClose(); }}
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">Topic</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="inp text-sm"
            onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") onClose(); }}
          />
        </div>
        {/* Duration & Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">Duration (mins)</label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="inp text-sm"
              onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") onClose(); }}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">Date</label>
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="inp text-sm"
            />
          </div>
        </div>
        {/* Notes */}
        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="inp resize-none min-h-[100px] text-sm"
            placeholder="Add detailed notes..."
          />
        </div>
      </div>
    </Drawer>
  );
}
