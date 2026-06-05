import ChartPanel from "../components/ChartPanel";
import PageHeader from "../components/PageHeader";
import { useAsyncData } from "../hooks/useAsyncData";
import { api } from "../services/api";

export default function Analytics() {
  const { data, loading, error } = useAsyncData(() => api.analytics(), []);

  if (loading) return <p className="text-sm text-slate-500">Loading analytics...</p>;
  if (error || !data) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <>
      <PageHeader title="Analytics" subtitle="Visual trends across study hours, coding, task completion, and placement activity." />
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartPanel title="Study Hours" data={data.charts.studyHours} />
        <ChartPanel title="Coding Progress" data={data.charts.codingProgress} type="bar" />
        <ChartPanel title="Tasks Completed" data={data.charts.tasksCompleted} type="bar" />
        <ChartPanel title="Placement Activity" data={data.charts.placementActivity} />
        <ChartPanel title="Difficulty Distribution" data={data.charts.difficultyDistribution} type="pie" />
      </div>
    </>
  );
}
