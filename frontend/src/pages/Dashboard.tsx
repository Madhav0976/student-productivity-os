import { BookOpen, Briefcase, Code2, FileText, ListTodo } from "lucide-react";
import ChartPanel from "../components/ChartPanel";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { useAsyncData } from "../hooks/useAsyncData";
import { api } from "../services/api";

export default function Dashboard() {
  const { data, loading, error } = useAsyncData(() => api.analytics(), []);

  if (loading) return <p className="text-sm text-slate-500">Loading dashboard...</p>;
  if (error || !data) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Your daily command center for study, coding, notes, and placements." />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Today's Tasks" value={data.summary.todayTasks} detail="Due today" icon={ListTodo} />
        <StatCard title="Study Hours" value={data.summary.studyHours} detail="Total logged" icon={BookOpen} />
        <StatCard title="Coding Streak" value={data.summary.codingStreak} detail="Days active" icon={Code2} />
        <StatCard title="Placement Progress" value={`${data.summary.placementProgress}%`} detail="Offer conversion" icon={Briefcase} />
        <StatCard title="Notes" value={data.summary.notesCount} detail="Saved notes" icon={FileText} />
      </section>
      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartPanel title="Study Hours This Week" data={data.charts.studyHours} />
        <ChartPanel title="Coding Progress This Week" data={data.charts.codingProgress} type="bar" />
      </section>
    </>
  );
}
