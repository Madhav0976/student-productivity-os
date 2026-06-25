import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CalendarDays,
  Code2,
  FileText,
  Flame,
  ListTodo,
  Plus,
} from "lucide-react";

import PageHeader from "../components/PageHeader";
import ProgressBar from "../components/ProgressBar";
import StatCard from "../components/StatCard";
import Button from "../components/ui/Button";
import { useAsyncData } from "../hooks/useAsyncData";
import { api } from "../services/api";


export default function Dashboard() {
  const { data, loading, error } = useAsyncData(() => api.analytics(), []);

  if (loading)
    return (
      <p className="text-sm text-slate-500">
        Loading dashboard...
      </p>
    );

  if (error || !data)
    return (
      <p className="text-sm text-red-500">
        {error}
      </p>
    );

  return (
    <>
      <PageHeader
        title="Good Evening 👋"
        subtitle="Let's make today productive."
      />

      {/* Stats */}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Today's Tasks"
          value={data.summary.todayTasks}
          detail="Pending today"
          icon={ListTodo}
        />

        <StatCard
          title="Study Hours"
          value={`${data.summary.studyHours} hrs`}
          detail="Today's progress"
          icon={BookOpen}
        />

        <StatCard
          title="Coding Streak"
          value={`${data.summary.codingStreak} 🔥`}
          detail="Current streak"
          icon={Code2}
        />

        <StatCard
          title="Placement Progress"
          value={`${data.summary.placementProgress}%`}
          detail="Application pipeline"
          icon={Briefcase}
        />

      </section>

      {/* Main Grid */}

      <section className="mt-8 grid gap-6 xl:grid-cols-3">

        {/* Left */}

        <div className="xl:col-span-2 space-y-6">

          {/* Today's Focus */}

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-semibold">
                Today's Focus
              </h2>

              <ListTodo className="h-5 w-5 text-blue-600" />

            </div>

            <div className="mt-6 space-y-4">

              <div className="flex items-center justify-between rounded-xl border p-4 hover:bg-slate-50">

                <span>Complete today's tasks</span>

                <ArrowRight size={18} />

              </div>

              <div className="flex items-center justify-between rounded-xl border p-4 hover:bg-slate-50">

                <span>Log today's study session</span>

                <ArrowRight size={18} />

              </div>

              <div className="flex items-center justify-between rounded-xl border p-4 hover:bg-slate-50">

                <span>Solve coding problems</span>

                <ArrowRight size={18} />

              </div>

            </div>

          </div>

          {/* Study Progress */}

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-semibold">
                Study Progress
              </h2>

              <BookOpen className="h-5 w-5 text-green-600" />

            </div>

            <div className="mt-6">

              <ProgressBar
                value={Math.min(data.summary.studyHours * 20, 100)}
              />

              <p className="mt-3 text-sm text-slate-500">

                {data.summary.studyHours} / 5 hours completed today

              </p>

            </div>

          </div>

        </div>

        {/* Right */}

        <div className="space-y-6">

          {/* Streak */}

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <Flame className="text-orange-500" />

              <h2 className="font-semibold">

                Current Streak

              </h2>

            </div>

            <div className="mt-5 text-4xl font-bold">

              {data.summary.codingStreak}

            </div>

            <p className="text-slate-500">

              Keep learning every day 🚀

            </p>

          </div>

          {/* Upcoming */}

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <CalendarDays className="text-violet-600" />

              <h2 className="font-semibold">

                Upcoming

              </h2>

            </div>

            <div className="mt-5 space-y-3 text-sm">

              <div className="rounded-lg bg-slate-100 p-3">

                No upcoming deadlines

              </div>

            </div>

          </div>

          {/* Quick Actions */}

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <h2 className="font-semibold">

              Quick Actions

            </h2>

            <div className="mt-5 grid gap-3">

              <Button>

                <Plus size={18} />

                New Task

              </Button>

              <Button variant="secondary">

                <FileText size={18} />

                New Note

              </Button>

              <Button variant="secondary">

                <BookOpen size={18} />

                Study Session

              </Button>

              <Button variant="secondary">

                <Briefcase size={18} />

                Placement

              </Button>

            </div>

          </div>

        </div>

      </section>

    </>
  );
}