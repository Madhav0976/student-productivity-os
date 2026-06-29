import { FormEvent, useState } from "react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
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
        <Card className="dark:!bg-slate-900/50 dark:!border-slate-800 h-fit">
          <form onSubmit={submit} className="space-y-4">
            <Input label="Company Name" placeholder="E.g., Google" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
            <Input label="Role" placeholder="E.g., Software Engineer" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
            <Input label="Application Date" type="date" value={form.applicationDate} onChange={(e) => setForm({ ...form, applicationDate: e.target.value })} required />
            
            <div className="space-y-1.5">
               <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
               <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as PlacementStatus })}>
                 <option>Applied</option><option>OA Completed</option><option>Interview</option><option>Rejected</option><option>Offer</option>
               </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes (Optional)</label>
              <textarea 
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white min-h-[80px] resize-none" 
                placeholder="Important links, next steps..." 
                value={form.notes} 
                onChange={(e) => setForm({ ...form, notes: e.target.value })} 
              />
            </div>
            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full">Add Company</Button>
            </div>
          </form>
        </Card>
        
        <div className="grid gap-4 md:grid-cols-2 content-start">
          {data?.map((item) => (
            <Card key={item._id} className="dark:!bg-slate-900/50 dark:!border-slate-800 flex flex-col p-5">
              <div className="flex-1">
                <h2 className="font-semibold text-lg text-slate-900 dark:text-white truncate" title={item.companyName}>{item.companyName}</h2>
                <p className="text-sm font-medium text-brand-500 dark:text-brand-400 mt-0.5">{item.role}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Applied: {new Date(item.applicationDate).toLocaleDateString()}</p>
                {item.notes && <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{item.notes}</p>}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <select 
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition-all focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white" 
                  value={item.status} 
                  onChange={(e) => api.updatePlacement(item._id, { status: e.target.value as PlacementStatus }).then(reload)}
                >
                  <option>Applied</option><option>OA Completed</option><option>Interview</option><option>Rejected</option><option>Offer</option>
                </select>
              </div>
            </Card>
          ))}
          {data?.length === 0 && (
             <div className="col-span-2 text-center py-10 text-sm text-slate-500">No placements tracked yet. Log your first application!</div>
          )}
        </div>
      </section>
    </>
  );
}
