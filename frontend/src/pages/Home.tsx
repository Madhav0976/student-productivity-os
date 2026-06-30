import React, { useEffect, useState } from "react";
import { parseISO, isToday, isFuture } from "date-fns";
import { useAuthStore } from "../store/authStore";
import { useTaskStore } from "../store/taskStore";
import { useGoalStore } from "../store/goalStore";
import { useCodingStore } from "../store/codingStore";
import { usePlacementStore } from "../store/placementStore";
import { useStudyStore } from "../store/studyStore";
import { useNoteStore } from "../store/noteStore";
import { isOverdue, getDaysUntil } from "../utils/dates";

import TodayHeader from "../components/home/TodayHeader";
import QuickCaptureStrip from "../components/home/QuickCaptureStrip";
import FocusCard from "../components/home/FocusCard";
import TimelineCard from "../components/home/TimelineCard";
import ProgressCard from "../components/home/ProgressCard";
import UpcomingCard, { UpcomingItem } from "../components/home/UpcomingCard";
import ActivityFeed, { ActivityItem } from "../components/home/ActivityFeed";

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const taskStore = useTaskStore();
  const goalStore = useGoalStore();
  const codingStore = useCodingStore();
  const placementStore = usePlacementStore();
  const studyStore = useStudyStore();
  const noteStore = useNoteStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      taskStore.fetch(),
      goalStore.fetch(),
      codingStore.fetch(),
      placementStore.fetch(),
      studyStore.fetch(),
      noteStore.fetch(),
    ]).finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split("T")[0];

  // Tasks
  const todayTasks = taskStore.tasks.filter((t) => 
    t.dueDate?.split("T")[0] === today || isToday(parseISO(t.dueDate))
  );
  const pendingTasks = taskStore.tasks.filter((t) => t.status !== "Completed");
  const overdueTasks = taskStore.tasks.filter((t) => isOverdue(t.dueDate) && t.status !== "Completed");
  const completedToday = todayTasks.filter((t) => t.status === "Completed").length;

  // Coding & Study
  const todayCodingCount = codingStore.getTodayCount();
  const todayCodingProblems = codingStore.problems.filter(p => isToday(parseISO(p.solvedDate)));
  const todayStudyHours = studyStore.getTodayHours();
  const todayStudySessions = studyStore.sessions.filter(s => isToday(parseISO(s.sessionDate)));

  // Placements
  const activeApplications = placementStore.placements.filter((p) => !["Rejected", "Offer"].includes(p.status));
  const todayPlacements = placementStore.placements.filter(p => p.updatedAt && isToday(parseISO(p.updatedAt)));

  // Goals
  const activeGoals = goalStore.goals.filter((g) => g.status !== "Completed");

  // Productivity Score logic (can be refined)
  const productivityScore = Math.min(100, Math.round(
    (completedToday > 0 ? 30 : 0) +
    (todayCodingCount > 0 ? 25 : 0) +
    (todayStudyHours > 0 ? 25 : 0) +
    (activeGoals.length > 0 ? 20 : 0)
  ));

  // Upcoming Items (Next 7 days)
  const upcomingItems: UpcomingItem[] = [];
  
  pendingTasks.forEach(t => {
    if (isFuture(parseISO(t.dueDate)) && getDaysUntil(t.dueDate) <= 7) {
      upcomingItems.push({ id: t._id, title: t.title, date: t.dueDate, type: "Task" });
    }
  });
  activeGoals.forEach(g => {
    if (isFuture(parseISO(g.targetDate)) && getDaysUntil(g.targetDate) <= 7) {
      upcomingItems.push({ id: g._id, title: g.goalName, date: g.targetDate, type: "Goal" });
    }
  });
  upcomingItems.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Recent Activity Feed
  let activities: ActivityItem[] = [];
  taskStore.tasks.filter(t => t.status === "Completed").forEach(t => {
    activities.push({ id: t._id, title: t.title, timestamp: t.updatedAt, type: 'task' });
  });
  noteStore.notes.forEach(n => {
    activities.push({ id: n._id, title: n.title, timestamp: n.updatedAt, type: 'note' });
  });
  codingStore.problems.forEach(p => {
    activities.push({ id: p._id, title: p.title, timestamp: p.createdAt || p.solvedDate, type: 'coding' });
  });
  studyStore.sessions.forEach(s => {
    activities.push({ id: s._id, title: s.subject, timestamp: s.createdAt || s.sessionDate, type: 'study' });
  });
  // Sort activities by timestamp descending
  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Progress metrics
  const taskProgress = todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0;
  const studyProgress = Math.min(100, (todayStudyHours / 2) * 100); // Assume 2h daily goal
  const codingProgress = Math.min(100, (todayCodingCount / 1) * 100); // Assume 1 problem daily goal
  const goalProgress = activeGoals.length > 0 ? activeGoals[0].progressPercentage : 0;

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <TodayHeader 
        userName={user?.name}
        overdueCount={overdueTasks.length}
        pendingCount={pendingTasks.length}
        productivityScore={productivityScore}
      />

      <QuickCaptureStrip />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Main Timeline & Focus */}
        <div className="lg:col-span-8 space-y-6">
          <FocusCard 
            loading={loading}
            upcomingTasks={pendingTasks}
            overdueTasks={overdueTasks}
            todayTasks={todayTasks}
          />

          <TimelineCard 
            loading={loading}
            tasks={todayTasks}
            studySessions={todayStudySessions}
            placements={todayPlacements}
            coding={todayCodingProblems}
          />
        </div>

        {/* Right Column - Widgets */}
        <div className="lg:col-span-4 space-y-6">
          <ProgressCard 
            loading={loading}
            taskProgress={taskProgress}
            studyProgress={studyProgress}
            codingProgress={codingProgress}
            goalProgress={goalProgress}
          />

          <UpcomingCard loading={loading} items={upcomingItems} />

          <ActivityFeed loading={loading} activities={activities} />
        </div>
      </div>
    </div>
  );
}
