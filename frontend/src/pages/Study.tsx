import { FormEvent, useMemo, useState } from "react";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/PageHeader";
import ProgressBar from "../components/ProgressBar";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAsyncData } from "../hooks/useAsyncData";
import { api } from "../services/api";
import { StudySession } from "../types";

const initialForm = { subject: "", topic: "", duration: 1, completed: false, notes: "", sessionDate: new Date().toISOString().slice(0, 10) };

export default function Study() {
  const [form, setForm] = useState(initialForm);
  const { data, loading, reload } = useAsyncData<StudySession[]>(() => api.studySessions(), []);
  const completed = data?.filter((session) => session.completed).length || 0;
  const progress = useMemo(() => data?.length ? Math.round((completed / data.length) * 100) : 0, [data, completed]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await api.createStudySession(form);
    setForm(initialForm);
    await reload();
  };

  return (
    <>
      <PageHeader title="Study Planner" subtitle="Plan sessions, log duration, and track weekly or monthly completion." />
      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="dark:!bg-slate-900/50 dark:!border-slate-800">
          <form onSubmit={submit} className="space-y-4">
            <Input label="Subject" placeholder="E.g., Operating Systems" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
            <Input label="Topic" placeholder="E.g., Virtual Memory" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} required />
            <Input label="Duration (hrs)" type="number" min="0" step="0.5" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} required />
            <Input label="Date" type="date" value={form.sessionDate} onChange={(e) => setForm({ ...form, sessionDate: e.target.value })} />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes</label>
              <textarea 
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white min-h-[100px] resize-none" 
                placeholder="Study session notes..." 
                value={form.notes} 
                onChange={(e) => setForm({ ...form, notes: e.target.value })} 
              />
            </div>
            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full">Add Study Session</Button>
            </div>
          </form>
        </Card>
        
        <div className="space-y-6">
          <Card className="dark:!bg-slate-900/50 dark:!border-slate-800">
            <div className="mb-2 flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
              <span>Completion Progress</span>
              <span>{progress}%</span>
            </div>
            <ProgressBar value={progress} />
          </Card>
          
          {loading ? <p className="text-slate-500">Loading...</p> : data?.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {data.map((session) => (
                <Card key={session._id} className="dark:!bg-slate-900/50 dark:!border-slate-800 flex flex-col">
                  <div className="mb-4">
                    <h2 className="font-semibold text-slate-900 dark:text-white line-clamp-1" title={`${session.subject}: ${session.topic}`}>
                      {session.subject}: {session.topic}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">{session.duration} hours • {new Date(session.sessionDate).toLocaleDateString()}</p>
                    {session.notes && <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 line-clamp-3">{session.notes}</p>}
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button 
                      variant={session.completed ? "outline" : "primary"} 
                      className="w-full" 
                      onClick={() => api.updateStudySession(session._id, { completed: !session.completed }).then(reload)}
                    >
                      {session.completed ? "Mark Pending" : "Mark Completed"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : <EmptyState type="study" action={{ label: "Add your first planned session", onClick: () => {} }} />}
        </div>
      </section>
    </>
  );
}
