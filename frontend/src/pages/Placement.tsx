import { FormEvent, useState } from "react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { useAsyncData } from "../hooks/useAsyncData";
import { api } from "../services/api";
import { Placement as PlacementItem, PlacementStatus } from "../types";
import { Briefcase, CheckCircle2, MessageSquare } from "lucide-react";

const initialForm = { companyName: "", role: "", applicationDate: new Date().toISOString().slice(0, 10), status: "Applied" as PlacementStatus, notes: "" };

export default function Placement() {
  const [form, setForm] = useState(initialForm);
  const { data, reload } = useAsyncData<PlacementItem[]>(() => api.placements(), []);
  const offers = data?.filter((item) => item.status === "Offer").length || 0;
  const interviews = data?.filter((item) => ["Interview", "Offer", "Rejected"].includes(item.status)).length || 0;
  const successRate = data?.length ? Math.round((offers / data.length) * 100) : 0;
  const interviewRate = data?.length ? Math.round((interviews / data.length) * 100) : 0;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await api.createPlacement(form);
    setForm(initialForm);
    await reload();
  };

  return (
    <>
      <PageHeader title="Placement Tracker" subtitle="Track applications, OAs, interviews, rejections, and offers." />
      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard title="Applications" value={data?.length || 0} detail="Companies applied" icon={Briefcase} />
        <StatCard title="Success Rate" value={`${successRate}%`} detail="Offers received" icon={CheckCircle2} />
        <StatCard title="Interview Rate" value={`${interviewRate}%`} detail="Interview conversion" icon={MessageSquare} />
      </section>
      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form onSubmit={submit} className="panel space-y-3">
          <input className="input" placeholder="Company name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
          <input className="input" placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
          <input className="input" type="date" value={form.applicationDate} onChange={(e) => setForm({ ...form, applicationDate: e.target.value })} required />
          <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as PlacementStatus })}>
            <option>Applied</option><option>OA Completed</option><option>Interview</option><option>Rejected</option><option>Offer</option>
          </select>
          <textarea className="input min-h-24" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <button className="btn-primary w-full">Add Company</button>
        </form>
        <div className="panel grid gap-3 md:grid-cols-2">
          {data?.map((item) => (
            <article key={item._id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <h2 className="font-semibold">{item.companyName}</h2>
              <p className="text-sm text-slate-500">{item.role} • {new Date(item.applicationDate).toLocaleDateString()}</p>
              <select className="input mt-3" value={item.status} onChange={(e) => api.updatePlacement(item._id, { status: e.target.value as PlacementStatus }).then(reload)}>
                <option>Applied</option><option>OA Completed</option><option>Interview</option><option>Rejected</option><option>Offer</option>
              </select>
              <p className="mt-3 text-sm">{item.notes}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
