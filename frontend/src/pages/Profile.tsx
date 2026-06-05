import { Award, BookOpen, Briefcase, Code2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { useAsyncData } from "../hooks/useAsyncData";
import { api } from "../services/api";
import { useAuthStore } from "../store/authStore";

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const { data, loading } = useAsyncData(() => api.analytics(), []);

  return (
    <>
      <PageHeader title="Profile" subtitle="Academic identity and productivity snapshot." />
      <section className="panel mb-6">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div><dt className="text-sm text-slate-500">Name</dt><dd className="font-semibold">{user?.name}</dd></div>
          <div><dt className="text-sm text-slate-500">Email</dt><dd className="font-semibold">{user?.email}</dd></div>
          <div><dt className="text-sm text-slate-500">College</dt><dd className="font-semibold">{user?.college}</dd></div>
          <div><dt className="text-sm text-slate-500">Branch</dt><dd className="font-semibold">{user?.branch}</dd></div>
          <div><dt className="text-sm text-slate-500">Graduation Year</dt><dd className="font-semibold">{user?.graduationYear}</dd></div>
        </dl>
      </section>
      {!loading && data && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Productivity Score" value={data.summary.productivityScore} detail="Out of 100" icon={Award} />
          <StatCard title="Coding Streak" value={data.summary.codingStreak} detail="Current streak" icon={Code2} />
          <StatCard title="Study Hours" value={data.summary.studyHours} detail="Total hours" icon={BookOpen} />
          <StatCard title="Applications" value={data.placement.totalApplications} detail={`${data.placement.successRate}% success rate`} icon={Briefcase} />
        </section>
      )}
    </>
  );
}
