import { FormEvent, useState } from "react";
import PageHeader from "../components/PageHeader";
import ProgressBar from "../components/ProgressBar";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
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
        <Card className="dark:!bg-slate-900/50 dark:!border-slate-800">
          <form onSubmit={submit} className="space-y-4">
            <Input label="Goal Name" placeholder="E.g., Learn React" value={form.goalName} onChange={(e) => setForm({ ...form, goalName: e.target.value })} required />
            <Input label="Target Date" type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} required />
            <Input label="Progress (%)" type="number" min="0" max="100" value={form.progressPercentage} onChange={(e) => setForm({ ...form, progressPercentage: Number(e.target.value) })} />
            <div className="space-y-1.5">
               <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
               <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-brand focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as GoalStatus })}>
                 <option>Not Started</option><option>In Progress</option><option>Completed</option>
               </select>
            </div>
            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full">Create Goal</Button>
            </div>
          </form>
        </Card>
        
        <div className="grid gap-4 md:grid-cols-2">
          {data?.map((goal) => (
            <Card key={goal._id} className="dark:!bg-slate-900/50 dark:!border-slate-800 p-0 flex flex-col">
              <div className="flex items-start justify-between gap-3 p-5">
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-slate-900 dark:text-white truncate">{goal.goalName}</h2>
                  <p className="text-sm text-slate-500 mt-1">Target: {new Date(goal.targetDate).toLocaleDateString()} • {goal.status}</p>
                </div>
                <span className="text-sm font-bold text-brand-500 bg-brand-500/10 px-2 py-1 rounded-md">{goal.progressPercentage}%</span>
              </div>
              <div className="px-5 pb-5 mt-auto">
                <div className="mb-4"><ProgressBar value={goal.progressPercentage} /></div>
                <input
                  className="w-full accent-blue-500 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none h-2 cursor-pointer"
                  type="range"
                  min="0"
                  max="100"
                  value={goal.progressPercentage}
                  onChange={(e) => updateProgress(goal, Number(e.target.value))}
                />
              </div>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
