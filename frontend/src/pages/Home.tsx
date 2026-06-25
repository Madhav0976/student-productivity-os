import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckSquare, Target, Code2, Briefcase, BookOpen, Zap,
  TrendingUp, Calendar, Star, Clock, ArrowRight, Flame,
  BarChart3, FileText, Bell
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useTaskStore } from "../store/taskStore";
import { useGoalStore } from "../store/goalStore";
import { useCodingStore } from "../store/codingStore";
import { usePlacementStore } from "../store/placementStore";
import { useStudyStore } from "../store/studyStore";
import { useUIStore } from "../store/uiStore";
import StatCard from "../components/ui/StatCard";
import ProgressRing from "../components/ui/ProgressRing";
import { SkeletonStat, SkeletonRow } from "../components/ui/Skeleton";
import { formatDateShort, getGreeting, getDayName, getFullDate, isOverdue } from "../utils/dates";
import { formatRelative } from "../utils/dates";
import { parseISO, isToday } from "date-fns";

const AI_INSIGHTS = [
  { icon: "🔥", text: "You're most productive on Tuesdays. Schedule deep work then.", type: "tip" },
  { icon: "📈", text: "Your task completion rate improved by 18% this week.", type: "achievement" },
  { icon: "⚠️", text: "Coding streak might break — log at least one problem today.", type: "warning" },
  { icon: "🎯", text: "3 deadlines approaching in the next 5 days. Review your goals.", type: "suggestion" },
];

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { openQuickCapture } = useUIStore();
  
  const taskStore = useTaskStore();
  const goalStore = useGoalStore();
  const codingStore = useCodingStore();
  const placementStore = usePlacementStore();
  const studyStore = useStudyStore();

  const [loading, setLoading] = useState(true);
  const [insightIdx] = useState(() => Math.floor(Math.random() * AI_INSIGHTS.length));

  useEffect(() => {
    Promise.all([
      taskStore.fetch(),
      goalStore.fetch(),
      codingStore.fetch(),
      placementStore.fetch(),
      studyStore.fetch(),
    ]).finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const todayTasks = taskStore.tasks.filter((t) => 
    t.dueDate?.split("T")[0] === today || isToday(parseISO(t.dueDate))
  );
  const pendingTasks = taskStore.tasks.filter((t) => t.status !== "Completed");
  const overdueTasks = taskStore.tasks.filter((t) => isOverdue(t.dueDate) && t.status !== "Completed");
  const completedToday = todayTasks.filter((t) => t.status === "Completed").length;
  const streak = codingStore.getStreak();
  const todayCoding = codingStore.getTodayCount();
  const activeGoals = goalStore.goals.filter((g) => g.status !== "Completed");
  const totalStudyHours = studyStore.getTotalHours();
  const activeApplications = placementStore.placements.filter((p) => !["Rejected", "Offer"].includes(p.status));
  
  const productivityScore = Math.min(100, Math.round(
    (completedToday > 0 ? 30 : 0) +
    (todayCoding > 0 ? 25 : 0) +
    (studyStore.getTodayHours() > 0 ? 25 : 0) +
    (activeGoals.length > 0 ? 20 : 0)
  ));

  const insight = AI_INSIGHTS[insightIdx];
  const upcomingTasks = pendingTasks
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Hero greeting ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-slate-500 text-sm font-medium">{getDayName()}, {getFullDate()}</p>
          <h1 className="text-2xl font-bold text-white mt-0.5">
            {getGreeting()}, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {overdueTasks.length > 0
              ? `You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? "s" : ""} — let's catch up.`
              : `You're on track. ${pendingTasks.length} task${pendingTasks.length !== 1 ? "s" : ""} remaining today.`
            }
          </p>
        </div>

        {/* Daily score */}
        <div className="card px-4 py-3 flex items-center gap-3">
          <ProgressRing progress={productivityScore} size={56} strokeWidth={5} showPercent />
          <div>
            <p className="text-2xs text-slate-500 font-medium">TODAY'S SCORE</p>
            <p className="text-sm font-bold text-white mt-0.5">
              {productivityScore < 40 ? "Getting started" : productivityScore < 70 ? "Good progress" : "On fire! 🔥"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Quick capture strip ───────────────────────────────────── */}
      <div className="card p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-2xs text-slate-500 font-medium uppercase tracking-wider mr-1">Quick add:</span>
          {[
            { label: "Task", icon: CheckSquare, color: "text-blue-400" },
            { label: "Goal", icon: Target, color: "text-purple-400" },
            { label: "Problem", icon: Code2, color: "text-amber-400" },
            { label: "Note", icon: FileText, color: "text-slate-300" },
            { label: "Application", icon: Briefcase, color: "text-pink-400" },
          ].map(({ label, icon: Icon, color }) => (
            <button
              key={label}
              onClick={openQuickCapture}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 
                         border border-[var(--border)] hover:border-slate-600 text-xs text-slate-400 
                         hover:text-white transition-all duration-150"
            >
              <Icon size={12} className={color} />
              {label}
            </button>
          ))}
          <div className="flex-1 hidden sm:flex justify-end">
            <kbd className="text-2xs text-slate-600 bg-white/5 border border-white/10 rounded px-2 py-1">
              Q — Quick capture
            </kbd>
          </div>
        </div>
      </div>

      {/* ── Stats row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonStat key={i} />)
        ) : (
          <>
            <StatCard
              label="Tasks Today"
              value={`${completedToday}/${todayTasks.length}`}
              icon={CheckSquare}
              iconColor="text-blue-400"
              sublabel={overdueTasks.length > 0 ? `${overdueTasks.length} overdue` : "All on time"}
              onClick={() => navigate("/tasks")}
            />
            <StatCard
              label="Coding Streak"
              value={streak}
              icon={Flame}
              iconColor="text-orange-400"
              sublabel={todayCoding > 0 ? `${todayCoding} today` : "Log a problem!"}
              onClick={() => navigate("/coding")}
            />
            <StatCard
              label="Study Hours"
              value={`${totalStudyHours.toFixed(1)}h`}
              icon={BookOpen}
              iconColor="text-emerald-400"
              sublabel="Total logged"
              onClick={() => navigate("/study")}
            />
            <StatCard
              label="Active Goals"
              value={activeGoals.length}
              icon={Target}
              iconColor="text-purple-400"
              sublabel={`${placementStore.placements.length} applications`}
              onClick={() => navigate("/goals")}
            />
          </>
        )}
      </div>

      {/* ── Main 2-col layout ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left col — tasks + schedule */}
        <div className="lg:col-span-2 space-y-4">
          {/* Today's tasks */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <CheckSquare size={15} className="text-blue-400" />
                <h2 className="text-sm font-semibold text-white">Today's Tasks</h2>
                {todayTasks.length > 0 && (
                  <span className="badge bg-white/5 text-slate-400">{todayTasks.length}</span>
                )}
              </div>
              <button onClick={() => navigate("/tasks")} className="text-2xs text-slate-500 hover:text-brand-400 flex items-center gap-1 transition-colors">
                View all <ArrowRight size={11} />
              </button>
            </div>
            
            {loading ? (
              <div className="py-2">
                {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
              </div>
            ) : upcomingTasks.length === 0 ? (
              <div className="py-8 text-center">
                <CheckSquare size={24} className="text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No pending tasks. Add one to get started.</p>
              </div>
            ) : (
              <div className="py-1">
                {upcomingTasks.map((task) => (
                  <button
                    key={task._id}
                    onClick={() => navigate("/tasks")}
                    className="task-row w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-all duration-150 text-left group"
                  >
                    <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors
                      ${task.status === "Completed" ? "bg-emerald-500 border-emerald-500" : "border-slate-600 group-hover:border-brand-500"}`}
                    >
                      {task.status === "Completed" && <span className="text-white text-2xs">✓</span>}
                    </div>
                    <span className={`flex-1 text-sm truncate ${task.status === "Completed" ? "line-through text-slate-500" : "text-slate-200"}`}>
                      {task.title}
                    </span>
                    <span className={`text-2xs flex-shrink-0 ${isOverdue(task.dueDate) && task.status !== "Completed" ? "text-red-400" : "text-slate-500"}`}>
                      {formatDateShort(task.dueDate)}
                    </span>
                    <span className={`badge flex-shrink-0 ${
                      task.priority === "High" ? "badge-high" 
                      : task.priority === "Medium" ? "badge-medium" 
                      : "badge-low"
                    }`}>
                      {task.priority}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Goals progress */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <Target size={15} className="text-purple-400" />
                <h2 className="text-sm font-semibold text-white">Goal Progress</h2>
              </div>
              <button onClick={() => navigate("/goals")} className="text-2xs text-slate-500 hover:text-brand-400 flex items-center gap-1 transition-colors">
                View all <ArrowRight size={11} />
              </button>
            </div>

            {loading ? (
              <div className="p-4 space-y-3">{Array.from({ length: 2 }).map((_, i) => <SkeletonRow key={i} />)}</div>
            ) : activeGoals.length === 0 ? (
              <div className="py-8 text-center">
                <Target size={24} className="text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Set your first goal.</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {activeGoals.slice(0, 3).map((goal) => (
                  <div key={goal._id} className="space-y-1.5 cursor-pointer group" onClick={() => navigate("/goals")}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-slate-200 truncate group-hover:text-white transition-colors">{goal.goalName}</span>
                      <span className="text-2xs text-slate-500 flex-shrink-0">{goal.progressPercentage}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full gradient-brand rounded-full transition-all duration-700"
                        style={{ width: `${goal.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-4">
          {/* AI Insight */}
          <div className="card p-4 bg-gradient-to-br from-brand-600/10 to-accent-500/5 border-brand-600/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 gradient-brand rounded-lg flex items-center justify-center">
                <Zap size={12} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-brand-300">AI Insight</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              <span className="mr-1.5">{insight.icon}</span>
              {insight.text}
            </p>
          </div>

          {/* Placement pipeline mini */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Briefcase size={14} className="text-pink-400" />
                <h3 className="text-sm font-semibold text-white">Placement Pipeline</h3>
              </div>
              <button onClick={() => navigate("/placements")} className="text-2xs text-slate-500 hover:text-brand-400 transition-colors">
                <ArrowRight size={12} />
              </button>
            </div>
            
            {loading ? (
              <SkeletonRow />
            ) : (
              <div className="space-y-2">
                {(["Applied", "OA", "Interview", "Offer"] as const).map((stage) => {
                  const count = placementStore.placements.filter((p) => p.status === stage).length;
                  return (
                    <div key={stage} className="flex items-center gap-2">
                      <span className="text-2xs text-slate-500 w-16 flex-shrink-0">{stage}</span>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            stage === "Offer" ? "bg-emerald-500" 
                            : stage === "Interview" ? "bg-amber-500"
                            : "bg-brand-600"
                          }`}
                          style={{ width: count > 0 ? `${Math.min(100, count * 20)}%` : "0%" }}
                        />
                      </div>
                      <span className="text-2xs text-white font-medium w-4 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Coding stats */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code2 size={14} className="text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Coding</h3>
              </div>
              <button onClick={() => navigate("/coding")} className="text-2xs text-slate-500 hover:text-brand-400 transition-colors">
                <ArrowRight size={12} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Flame size={12} className="text-orange-400" />
                  <span className="text-2xs text-slate-500">Streak</span>
                </div>
                <p className="text-xl font-bold text-white">{streak}</p>
                <p className="text-2xs text-slate-600 mt-0.5">days</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CheckSquare size={12} className="text-blue-400" />
                  <span className="text-2xs text-slate-500">Total</span>
                </div>
                <p className="text-xl font-bold text-white">{codingStore.problems.length}</p>
                <p className="text-2xs text-slate-600 mt-0.5">solved</p>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="card p-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h3>
            <div className="space-y-1.5">
              {[
                { label: "View Analytics", icon: BarChart3, to: "/analytics", color: "text-indigo-400" },
                { label: "Open Calendar", icon: Calendar, to: "/calendar", color: "text-cyan-400" },
                { label: "Study Timer", icon: Clock, to: "/study", color: "text-emerald-400" },
              ].map(({ label, icon: Icon, to, color }) => (
                <button
                  key={to}
                  onClick={() => navigate(to)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-all text-left group"
                >
                  <Icon size={14} className={color} />
                  <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{label}</span>
                  <ArrowRight size={12} className="ml-auto text-slate-600 group-hover:text-slate-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
