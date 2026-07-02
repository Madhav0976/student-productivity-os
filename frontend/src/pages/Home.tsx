import React, { useEffect, useState, useMemo } from "react";
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
  const tasks = useTaskStore((s) => s.tasks);
  const fetchTasks = useTaskStore((s) => s.fetch);
  const goals = useGoalStore((s) => s.goals);
  const fetchGoals = useGoalStore((s) => s.fetch);
  const codingProblems = useCodingStore((s) => s.problems);
  const fetchCoding = useCodingStore((s) => s.fetch);
  const getTodayCodingCount = useCodingStore((s) => s.getTodayCount);
  const placements = usePlacementStore((s) => s.placements);
  const fetchPlacements = usePlacementStore((s) => s.fetch);
  const studySessions = useStudyStore((s) => s.sessions);
  const fetchStudy = useStudyStore((s) => s.fetch);
  const getTodayStudyHours = useStudyStore((s) => s.getTodayHours);
  const notes = useNoteStore((s) => s.notes);
  const fetchNotes = useNoteStore((s) => s.fetch);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchTasks(),
      fetchGoals(),
      fetchCoding(),
      fetchPlacements(),
      fetchStudy(),
      fetchNotes(),
    ]).finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split("T")[0];

  // Tasks
  const { todayTasks, pendingTasks, overdueTasks, completedToday } = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    let completedToday = 0;
    const todayTasks: any[] = [];
    const pendingTasks: any[] = [];
    const overdueTasks: any[] = [];
    tasks.forEach(t => {
      if (t.status !== "Completed") {
        pendingTasks.push(t);
        if (isOverdue(t.dueDate)) overdueTasks.push(t);
      }
      if (t.dueDate?.split("T")[0] === today || isToday(parseISO(t.dueDate))) {
        todayTasks.push(t);
        if (t.status === "Completed") completedToday++;
      }
    });
    return { todayTasks, pendingTasks, overdueTasks, completedToday };
  }, [tasks]);

  // Coding & Study
  const { todayCodingCount, todayCodingProblems, todayStudyHours, todayStudySessions } = useMemo(() => {
    return {
      todayCodingCount: getTodayCodingCount(),
      todayCodingProblems: codingProblems.filter(p => isToday(parseISO(p.solvedDate))),
      todayStudyHours: getTodayStudyHours(),
      todayStudySessions: studySessions.filter(s => isToday(parseISO(s.sessionDate)))
    };
  }, [codingProblems, getTodayCodingCount, studySessions, getTodayStudyHours]);

  // Placements
  const { activeApplications, todayPlacements } = useMemo(() => {
    return {
      activeApplications: placements.filter((p) => !["Rejected", "Offer"].includes(p.status)),
      todayPlacements: placements.filter(p => p.updatedAt && isToday(parseISO(p.updatedAt)))
    };
  }, [placements]);

  // Goals
  const activeGoals = useMemo(() => goals.filter((g) => g.status !== "Completed"), [goals]);

  // Productivity Score logic (can be refined)
  const productivityScore = useMemo(() => Math.min(100, Math.round(
    (completedToday > 0 ? 30 : 0) +
    (todayCodingCount > 0 ? 25 : 0) +
    (todayStudyHours > 0 ? 25 : 0) +
    (activeGoals.length > 0 ? 20 : 0)
  )), [completedToday, todayCodingCount, todayStudyHours, activeGoals.length]);

  // Upcoming Items (Next 7 days)
  const upcomingItems: UpcomingItem[] = useMemo(() => {
    const items: UpcomingItem[] = [];
    pendingTasks.forEach((t: any) => {
      if (isFuture(parseISO(t.dueDate)) && getDaysUntil(t.dueDate) <= 7) {
        items.push({ id: t._id, title: t.title, date: t.dueDate, type: "Task" });
      }
    });
    activeGoals.forEach((g: any) => {
      if (isFuture(parseISO(g.targetDate)) && getDaysUntil(g.targetDate) <= 7) {
        items.push({ id: g._id, title: g.goalName, date: g.targetDate, type: "Goal" });
      }
    });
    items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return items;
  }, [pendingTasks, activeGoals]);

  // Recent Activity Feed
  const activities: ActivityItem[] = useMemo(() => {
    const items: ActivityItem[] = [];
    tasks.filter(t => t.status === "Completed").forEach(t => {
      items.push({ id: t._id, title: t.title, timestamp: t.updatedAt || "", type: 'task' });
    });
    notes.forEach(n => {
      items.push({ id: n._id, title: n.title, timestamp: n.updatedAt || "", type: 'note' });
    });
    codingProblems.forEach(p => {
      items.push({ id: p._id, title: p.title, timestamp: p.createdAt || p.solvedDate, type: 'coding' });
    });
    studySessions.forEach(s => {
      items.push({ id: s._id, title: s.subject, timestamp: s.createdAt || s.sessionDate, type: 'study' });
    });
    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return items;
  }, [tasks, notes, codingProblems, studySessions]);

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
