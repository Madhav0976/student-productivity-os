import React, { useState } from "react";
import { Placement, PlacementStatus } from "../../types";
import { X, Save } from "lucide-react";
import Button from "../ui/Button";
import toast from "react-hot-toast";

interface PlacementEditorProps {
  placement: Placement;
  onCancel: () => void;
  onSave: (id: string, payload: Partial<Placement>) => Promise<void>;
}

export default function PlacementEditor({ placement, onCancel, onSave }: PlacementEditorProps) {
  const [companyName, setCompanyName] = useState(placement.companyName);
  const [role, setRole] = useState(placement.role);
  const [applicationDate, setApplicationDate] = useState(placement.applicationDate.split("T")[0]);
  const [status, setStatus] = useState<PlacementStatus>(placement.status);
  const [notes, setNotes] = useState(placement.notes || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!companyName.trim() || !role.trim()) { toast.error("Company and role are required"); return; }
    setSaving(true);
    try {
      await onSave(placement._id, {
        companyName: companyName.trim(), role: role.trim(), applicationDate, status, notes
      });
      toast.success("Application saved");
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
        <Button variant="primary" onClick={handleSave} disabled={saving} className="gap-2 bg-pink-600 hover:bg-pink-700 border-pink-600 text-white">
          <Save size={16} /> {saving ? "Saving..." : "Save Application"}
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-8 shadow-sm space-y-6">
        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Company Name</label>
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full bg-transparent border-b border-slate-200 dark:border-slate-800 outline-none text-3xl font-bold text-slate-900 dark:text-white pb-2 focus:border-pink-500 transition-colors placeholder:text-slate-300 dark:placeholder:text-slate-700"
            placeholder="E.g., Google"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Role</label>
            <input value={role} onChange={(e) => setRole(e.target.value)} className="inp text-sm w-full" placeholder="Software Engineer" />
          </div>
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as PlacementStatus)} className="inp text-sm w-full">
              <option value="Dream">Dream</option>
              <option value="Applied">Applied</option>
              <option value="OA">OA Completed</option>
              <option value="Interview">Interview</option>
              <option value="HR">HR Round</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Application Date</label>
            <input type="date" value={applicationDate} onChange={(e) => setApplicationDate(e.target.value)} className="inp text-sm w-full" />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Notes & Timeline</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-base text-slate-700 dark:text-slate-300 resize-y min-h-[250px] p-4 font-sans leading-relaxed placeholder:text-slate-400 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
            placeholder="Interview dates, links to JD, OA links..."
          />
        </div>
      </div>
    </div>
  );
}
