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
import Card from "../components/ui/Card";


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
          <Card className="dark:!bg-slate-900/50 dark:!border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Today's Focus
              </h2>
              <ListTodo className="h-5 w-5 text-brand-500" />
            </div >
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer text-slate-700 dark:text-slate-200">
                <span>Complete today's tasks</span>
                <ArrowRight size={18} className="text-slate-400" />
              </div >

              <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer text-slate-700 dark:text-slate-200">
                <span>Log today's study session</span>
                <ArrowRight size={18} className="text-slate-400" />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer text-slate-700 dark:text-slate-200">
                <span>Solve coding problems</span>
                <ArrowRight size={18} className="text-slate-400" />
              </div>
            </div>
          </Card>

          {/* Study Progress */}
          <Card className="dark:!bg-slate-900/50 dark:!border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Study Progress
              </h2>
              <BookOpen className="h-5 w-5 text-emerald-500" />
            </div >
            <div className="mt-6">
              <ProgressBar
                value={Math.min(data.summary.studyHours * 20, 100)}
              />

              <p className="mt-3 text-sm text-slate-500">

                {data.summary.studyHours} / 5 hours completed today

              </p>

            </div>

          </Card>

        </div>

        {/* Right */}

        <div className="space-y-6">

          {/* Streak */}
          <Card className="dark:!bg-slate-900/50 dark:!border-slate-800">
            <div className="flex items-center gap-3">
              <Flame className="text-orange-500" />
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Current Streak
              </h2>
            </div >

            <div className="mt-5 text-4xl font-bold text-slate-900 dark:text-white">
              {data.summary.codingStreak}
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Keep learning every day 🚀
            </p>
          </Card>

          {/* Upcoming */}
          <Card className="dark:!bg-slate-900/50 dark:!border-slate-800">
            <div className="flex items-center gap-3">
              <CalendarDays className="text-purple-500" />
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Upcoming
              </h2>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <div className="rounded-lg bg-slate-50 border border-slate-100 dark:border-slate-800 dark:bg-slate-900 p-3 text-slate-600 dark:text-slate-400">
                No upcoming deadlines
              </div>

            </div>

          </Card>

          {/* Quick Actions */}
          <Card className="dark:!bg-slate-900/50 dark:!border-slate-800">
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Quick Actions
            </h2>
            <div className="mt-5 grid gap-3">
              <Button variant="primary" className="w-full justify-start">
                <Plus size={18} />
                New Task
              </Button>

              <Button variant="outline" className="w-full justify-start text-slate-600 dark:text-slate-300">
                <FileText size={18} className="text-slate-400" />
                New Note
              </Button>

              <Button variant="outline" className="w-full justify-start text-slate-600 dark:text-slate-300">
                <BookOpen size={18} className="text-emerald-500" />
                Study Session
              </Button>

              <Button variant="outline" className="w-full justify-start text-slate-600 dark:text-slate-300">
                <Briefcase size={18} className="text-pink-500" />
                Placement
              </Button>
            </div>
          </Card>

        </div>

      </section>

    </>
  );
}