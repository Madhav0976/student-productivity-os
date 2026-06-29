import { FormEvent, useState } from "react";
import ChartPanel from "../components/ChartPanel";
import PageHeader from "../components/PageHeader";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAsyncData } from "../hooks/useAsyncData";
import { api } from "../services/api";
import { CodingProblem, Difficulty, Platform } from "../types";

const initialForm = { title: "", platform: "LeetCode" as Platform, difficulty: "Easy" as Difficulty, topic: "", solvedDate: new Date().toISOString().slice(0, 10), problemUrl: "" };

export default function Coding() {
  const [form, setForm] = useState(initialForm);
  const { data, reload } = useAsyncData<CodingProblem[]>(() => api.codingProblems(), []);
  const difficultyData = ["Easy", "Medium", "Hard"].map((name) => ({ name, value: data?.filter((item) => item.difficulty === name).length || 0 }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await api.createCodingProblem(form);
    setForm(initialForm);
    await reload();
  };

  return (
    <>
      <PageHeader title="Coding Tracker" subtitle="Log solved problems, platforms, topics, difficulty, and daily history." />
      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="dark:!bg-slate-900/50 dark:!border-slate-800">
          <form onSubmit={submit} className="space-y-4">
            <Input label="Problem Title" placeholder="E.g., Two Sum" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            
            <div className="space-y-1.5">
               <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Platform</label>
               <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value as Platform })}>
                 <option>LeetCode</option><option>Codeforces</option><option>HackerRank</option><option>GeeksForGeeks</option>
               </select>
            </div>
            
            <div className="space-y-1.5">
               <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Difficulty</label>
               <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as Difficulty })}>
                 <option>Easy</option><option>Medium</option><option>Hard</option>
               </select>
            </div>
            
            <Input label="Topic" placeholder="E.g., Arrays, DP" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} required />
            <Input label="Solved Date" type="date" value={form.solvedDate} onChange={(e) => setForm({ ...form, solvedDate: e.target.value })} />
            <Input label="Problem URL (Optional)" placeholder="https://leetcode.com/..." value={form.problemUrl} onChange={(e) => setForm({ ...form, problemUrl: e.target.value })} />
            
            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full">Add Solved Problem</Button>
            </div>
          </form>
        </Card>
        
        <div className="space-y-6">
          <ChartPanel title="Difficulty Distribution" data={difficultyData} type="pie" />
          
          <Card className="dark:!bg-slate-900/50 dark:!border-slate-800">
            <h2 className="mb-4 font-semibold text-slate-900 dark:text-white">History</h2>
            <div className="space-y-3">
              {data?.map((item) => (
                <article key={item._id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:border-brand-500/30 hover:bg-brand-50 dark:hover:bg-brand-600/5 transition-all duration-150">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-200">{item.title}</h3>
                    <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-2 py-1 rounded-md">{item.platform}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    <span className={`inline-block mr-2 font-medium ${item.difficulty === 'Easy' ? 'text-emerald-500' : item.difficulty === 'Medium' ? 'text-amber-500' : 'text-red-500'}`}>{item.difficulty}</span> 
                    • {item.topic} • {new Date(item.solvedDate).toLocaleDateString()}
                  </p>
                </article>
              ))}
              
              {data?.length === 0 && (
                <div className="text-center py-8 text-sm text-slate-500">No problems solved yet. Log your first one!</div>
              )}
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
