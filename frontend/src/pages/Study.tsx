import { FormEvent, useMemo, useState } from "react";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import ProgressBar from "../components/ProgressBar";
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
        <form onSubmit={submit} className="panel space-y-3">
          <input className="input" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
          <input className="input" placeholder="Topic" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} required />
          <input className="input" type="number" min="0" step="0.5" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} required />
          <input className="input" type="date" value={form.sessionDate} onChange={(e) => setForm({ ...form, sessionDate: e.target.value })} />
          <textarea className="input min-h-24" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <button className="btn-primary w-full">Add Study Session</button>
        </form>
        <div className="panel">
          <div className="mb-5">
            <div className="mb-2 flex justify-between text-sm"><span>Completion Progress</span><span>{progress}%</span></div>
            <ProgressBar value={progress} />
          </div>
          {loading ? <p>Loading...</p> : data?.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {data.map((session) => (
                <article key={session._id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <h2 className="font-semibold">{session.subject}: {session.topic}</h2>
                  <p className="text-sm text-slate-500">{session.duration} hours • {new Date(session.sessionDate).toLocaleDateString()}</p>
                  <p className="mt-2 text-sm">{session.notes}</p>
                  <button className="btn-secondary mt-3" onClick={() => api.updateStudySession(session._id, { completed: !session.completed }).then(reload)}>
                    {session.completed ? "Mark Pending" : "Mark Completed"}
                  </button>
                </article>
              ))}
            </div>
          ) : <EmptyState title="No study sessions" description="Add your first planned session." />}
        </div>
      </section>
    </>
  );
}
