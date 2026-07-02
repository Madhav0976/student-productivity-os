import React, { useEffect, useState, useMemo } from "react";
import { useStudyStore } from "../store/studyStore";
import { StudySession } from "../types";
import { startOfWeek, format, isToday, parseISO, subDays } from "date-fns";

import StudyHeader from "../components/study/StudyHeader";
import StudyQuickSession from "../components/study/StudyQuickSession";
import StudyProgress from "../components/study/StudyProgress";
import SubjectCard from "../components/study/SubjectCard";
import TodaySessions from "../components/study/TodaySessions";
import WeeklyOverview from "../components/study/WeeklyOverview";
import RecentSessions from "../components/study/RecentSessions";
import StudyDetail from "../components/study/StudyDetail";
import StudyEditor from "../components/study/StudyEditor";
import EmptyState from "../components/ui/EmptyState";
import { SkeletonStat, SkeletonCard, SkeletonRow } from "../components/ui/Skeleton";

// Mocks a goal for this milestone
const WEEKLY_GOAL_HOURS = 20;

export default function Study() {
  const { sessions, loading, fetch, create, update, remove, getTodayHours } = useStudyStore();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<StudySession | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch();
  }, [fetch]);

  // Derived state
  const todaySessions = useMemo(() => sessions.filter((s) => s.sessionDate && isToday(parseISO(s.sessionDate))), [sessions]);
  const recentSessions = useMemo(() => [...sessions].sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime()), [sessions]);
  
  // Weekly hours calculation
  const { weeklyHours, daysData } = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday start
    let totalMins = 0;
    const dayTotals = [0, 0, 0, 0, 0, 0, 0];
    
    sessions.forEach(s => {
      const d = parseISO(s.sessionDate);
      if (d >= start) {
        totalMins += s.duration;
        const dayIdx = (d.getDay() + 6) % 7; // 0=Mon, 6=Sun
        if (dayIdx >= 0 && dayIdx < 7) {
          dayTotals[dayIdx] += s.duration;
        }
      }
    });

    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const todayIdx = (new Date().getDay() + 6) % 7;
    
    return {
      weeklyHours: totalMins / 60,
      daysData: labels.map((label, i) => ({
        label,
        hours: dayTotals[i] / 60,
        isToday: i === todayIdx
      }))
    };
  }, [sessions]);

  // Subject Stats
  const subjectStats = useMemo(() => {
    const stats: Record<string, { total: number, weekly: number }> = {};
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    sessions.forEach(s => {
      if (!stats[s.subject]) stats[s.subject] = { total: 0, weekly: 0 };
      stats[s.subject].total += s.duration;
      if (parseISO(s.sessionDate) >= start) {
        stats[s.subject].weekly += s.duration;
      }
    });
    return Object.entries(stats).map(([subject, data]) => ({ subject, ...data }));
  }, [sessions]);

  // Streak Calculation
  const streak = useMemo(() => {
    if (sessions.length === 0) return 0;
    const dates = [...new Set(sessions.map(s => s.sessionDate.split("T")[0]))].sort((a, b) => b.localeCompare(a));
    let currentStreak = 0;
    let checkDate = new Date();
    
    // Check today and yesterday
    const todayStr = format(checkDate, "yyyy-MM-dd");
    if (!dates.includes(todayStr)) {
      checkDate = subDays(checkDate, 1);
      const yestStr = format(checkDate, "yyyy-MM-dd");
      if (!dates.includes(yestStr)) return 0;
    }

    while (true) {
      const dateStr = format(checkDate, "yyyy-MM-dd");
      if (dates.includes(dateStr)) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }
    return currentStreak;
  }, [sessions]);

  // Handlers
  const handleToggleComplete = async (id: string) => {
    const session = sessions.find((s) => s._id === id);
    if (session) {
      await update(id, { completed: !session.completed });
    }
  }

  if (selectedSession) {
    if (isEditing) {
      return (
        <StudyEditor
          session={selectedSession}
          onCancel={() => setIsEditing(false)}
          onSave={update}
        />
      );
    }
    return (
      <StudyDetail
        session={selectedSession}
        onBack={() => { setSelectedSession(null); setIsEditing(false); }}
        onEdit={() => setIsEditing(true)}
        onDelete={async (id) => { await remove(id); setSelectedSession(null); }}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl pb-24">
      {/* Header */}
      <StudyHeader
        todayHours={getTodayHours()}
        weeklyHours={weeklyHours}
        weeklyGoal={WEEKLY_GOAL_HOURS}
        streak={streak}
        subjectCount={subjectStats.length}
        onQuickAdd={() => setQuickAddOpen(true)}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Add */}
          <div className="card p-0 overflow-hidden shadow-sm dark:!bg-slate-900/50 dark:!border-slate-800">
            <StudyQuickSession
              isExpanded={quickAddOpen}
              onExpand={() => setQuickAddOpen(true)}
              onCollapse={() => setQuickAddOpen(false)}
              onAdd={create}
            />
          </div>

          {/* Progress */}
          <StudyProgress
            todayHours={getTodayHours()}
            weeklyHours={weeklyHours}
            weeklyGoal={WEEKLY_GOAL_HOURS}
            streak={streak}
            subjectsStudied={subjectStats.length}
          />

          {/* Subject Cards */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Subjects</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SkeletonCard /><SkeletonCard />
              </div>
            ) : subjectStats.length === 0 ? (
              <EmptyState type="study" action={{ label: "Log a session to track subjects", onClick: () => setQuickAddOpen(true) }} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjectStats.map(s => (
                  <SubjectCard
                    key={s.subject}
                    subject={s.subject}
                    totalMinutes={s.total}
                    weeklyMinutes={s.weekly}
                    weeklyGoalMinutes={(WEEKLY_GOAL_HOURS * 60) / subjectStats.length} // Dynamic goal per subject
                    onClick={() => {}}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Weekly Overview */}
          <div>
            {loading ? <SkeletonStat /> : (
              <WeeklyOverview
                days={daysData}
                maxHours={Math.max(...daysData.map(d => d.hours), 4)}
              />
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Today's Sessions */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Today's Sessions</h2>
            {loading ? (
              <div className="space-y-3"><SkeletonRow /><SkeletonRow /></div>
            ) : todaySessions.length === 0 ? (
              <EmptyState type="study" />
            ) : (
              <TodaySessions
                sessions={todaySessions}
                onToggleComplete={handleToggleComplete}
                onClick={setSelectedSession}
              />
            )}
          </div>

          {/* Recent Sessions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Sessions</h2>
            {loading ? (
              <div className="space-y-3"><SkeletonRow /><SkeletonRow /></div>
            ) : recentSessions.length === 0 ? (
              <EmptyState type="study" />
            ) : (
              <RecentSessions
                sessions={recentSessions}
                onClick={setSelectedSession}
              />
            )}
          </div>
        </div>
      </div>


    </div>
  );
}
