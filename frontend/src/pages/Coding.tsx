import { FormEvent, useState } from "react";
import ChartPanel from "../components/ChartPanel";
import PageHeader from "../components/PageHeader";
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
        <form onSubmit={submit} className="panel space-y-3">
          <input className="input" placeholder="Problem title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <select className="input" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value as Platform })}>
            <option>LeetCode</option><option>Codeforces</option><option>HackerRank</option><option>GeeksForGeeks</option>
          </select>
          <select className="input" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as Difficulty })}>
            <option>Easy</option><option>Medium</option><option>Hard</option>
          </select>
          <input className="input" placeholder="Topic" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} required />
          <input className="input" type="date" value={form.solvedDate} onChange={(e) => setForm({ ...form, solvedDate: e.target.value })} />
          <input className="input" placeholder="Problem URL" value={form.problemUrl} onChange={(e) => setForm({ ...form, problemUrl: e.target.value })} />
          <button className="btn-primary w-full">Add Solved Problem</button>
        </form>
        <div className="space-y-4">
          <ChartPanel title="Difficulty Distribution" data={difficultyData} type="pie" />
          <div className="panel">
            <h2 className="mb-3 font-semibold">History</h2>
            <div className="space-y-3">
              {data?.map((item) => (
                <article key={item._id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-semibold">{item.title}</h3>
                    <span className="text-xs font-semibold text-brand">{item.platform}</span>
                  </div>
                  <p className="text-sm text-slate-500">{item.difficulty} • {item.topic} • {new Date(item.solvedDate).toLocaleDateString()}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
