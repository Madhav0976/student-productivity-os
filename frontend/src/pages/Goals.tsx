import { FormEvent, useState } from "react";
import PageHeader from "../components/PageHeader";
import ProgressBar from "../components/ProgressBar";
import { useAsyncData } from "../hooks/useAsyncData";
import { api } from "../services/api";
import { Goal, GoalStatus } from "../types";

const initialForm = { goalName: "", targetDate: "", progressPercentage: 0, status: "Not Started" as GoalStatus };

export default function Goals() {
  const [form, setForm] = useState(initialForm);
  const { data, reload } = useAsyncData<Goal[]>(() => api.goals(), []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await api.createGoal(form);
    setForm(initialForm);
    await reload();
  };

  const updateProgress = async (goal: Goal, progressPercentage: number) => {
    await api.updateGoal(goal._id, {
      progressPercentage,
      status: progressPercentage >= 100 ? "Completed" : progressPercentage > 0 ? "In Progress" : "Not Started"
    });
    await reload();
  };

  return (
    <>
      <PageHeader title="Goals" subtitle="Set targets, update progress, and keep long-term outcomes visible." />
      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form onSubmit={submit} className="panel space-y-3">
          <input className="input" placeholder="Goal name" value={form.goalName} onChange={(e) => setForm({ ...form, goalName: e.target.value })} required />
          <input className="input" type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} required />
          <input className="input" type="number" min="0" max="100" value={form.progressPercentage} onChange={(e) => setForm({ ...form, progressPercentage: Number(e.target.value) })} />
          <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as GoalStatus })}>
            <option>Not Started</option><option>In Progress</option><option>Completed</option>
          </select>
          <button className="btn-primary w-full">Create Goal</button>
        </form>
        <div className="panel grid gap-3 md:grid-cols-2">
          {data?.map((goal) => (
            <article key={goal._id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{goal.goalName}</h2>
                  <p className="text-sm text-slate-500">Target {new Date(goal.targetDate).toLocaleDateString()} • {goal.status}</p>
                </div>
                <span className="text-sm font-bold text-brand">{goal.progressPercentage}%</span>
              </div>
              <div className="my-4"><ProgressBar value={goal.progressPercentage} /></div>
              <input
                className="input"
                type="range"
                min="0"
                max="100"
                value={goal.progressPercentage}
                onChange={(e) => updateProgress(goal, Number(e.target.value))}
              />
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
