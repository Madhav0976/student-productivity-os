import React, { useEffect, useState, useMemo } from "react";
import { useCodingStore } from "../store/codingStore";
import { CodingProblem } from "../types";
import { startOfWeek, parseISO, isToday } from "date-fns";

import CodingHeader from "../components/coding/CodingHeader";
import CodingQuickLog from "../components/coding/CodingQuickLog";
import StreakCard from "../components/coding/StreakCard";
import DifficultyOverview from "../components/coding/DifficultyOverview";
import TopicCard from "../components/coding/TopicCard";
import RecentProblems from "../components/coding/RecentProblems";
import CodingDrawer from "../components/coding/CodingDrawer";
import WeeklyOverview from "../components/study/WeeklyOverview"; // Reusing from study
import EmptyState from "../components/ui/EmptyState";
import { SkeletonStat, SkeletonCard, SkeletonRow } from "../components/ui/Skeleton";

const WEEKLY_GOAL = 10; // Mock goal

export default function Coding() {
  const { problems, loading, fetch, create, update, remove, getStreak, getTodayCount, getDifficultyBreakdown } = useCodingStore();
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem | null>(null);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const recentProblems = useMemo(() => [...problems].sort((a, b) => new Date(b.solvedDate).getTime() - new Date(a.solvedDate).getTime()), [problems]);
  const streak = getStreak();
  const todayCount = getTodayCount();
  const diff = getDifficultyBreakdown();

  // Weekly hours calculation (reusing logic but for counts)
  const { weeklyCount, daysData } = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    let totalCount = 0;
    const dayTotals = [0, 0, 0, 0, 0, 0, 0];
    
    problems.forEach(p => {
      const d = parseISO(p.solvedDate);
      if (d >= start) {
        totalCount++;
        const dayIdx = (d.getDay() + 6) % 7; 
        if (dayIdx >= 0 && dayIdx < 7) {
          dayTotals[dayIdx]++;
        }
      }
    });

    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const todayIdx = (new Date().getDay() + 6) % 7;
    
    return {
      weeklyCount: totalCount,
      daysData: labels.map((label, i) => ({
        label,
        hours: dayTotals[i], // Reusing the hours prop from WeeklyOverview for counts
        isToday: i === todayIdx
      }))
    };
  }, [problems]);

  // Topic Stats
  const topicStats = useMemo(() => {
    const stats: Record<string, { count: number, lastActivity: string }> = {};
    problems.forEach(p => {
      if (!stats[p.topic]) stats[p.topic] = { count: 0, lastActivity: p.solvedDate };
      stats[p.topic].count++;
      if (new Date(p.solvedDate) > new Date(stats[p.topic].lastActivity)) {
        stats[p.topic].lastActivity = p.solvedDate;
      }
    });
    return Object.entries(stats)
      .map(([topic, data]) => ({ topic, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [problems]);

  const longestStreak = useMemo(() => {
    if (!problems.length) return 0;
    let max = 0;
    let current = 1;
    const dates = [...new Set(problems.map(p => p.solvedDate.split("T")[0]))].sort((a, b) => a.localeCompare(b));
    for (let i = 1; i < dates.length; i++) {
      const d1 = new Date(dates[i - 1]);
      const d2 = new Date(dates[i]);
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      if (diffDays === 1) {
        current++;
      } else {
        max = Math.max(max, current);
        current = 1;
      }
    }
    return Math.max(max, current);
  }, [problems]);

  const lastPractice = problems.length > 0 ? recentProblems[0].solvedDate : null;

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl pb-24">
      <CodingHeader
        todayCount={todayCount}
        streak={streak}
        totalProblems={problems.length}
        weeklyProgress={weeklyCount}
        weeklyGoal={WEEKLY_GOAL}
        onQuickLog={() => setQuickLogOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-0 overflow-hidden shadow-sm dark:!bg-slate-900/50 dark:!border-slate-800">
            <CodingQuickLog
              isExpanded={quickLogOpen}
              onExpand={() => setQuickLogOpen(true)}
              onCollapse={() => setQuickLogOpen(false)}
              onAdd={create}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StreakCard currentStreak={streak} longestStreak={longestStreak} lastPractice={lastPractice} />
            <DifficultyOverview easy={diff.easy} medium={diff.medium} hard={diff.hard} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Topics Practiced</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SkeletonCard /><SkeletonCard />
              </div>
            ) : topicStats.length === 0 ? (
              <EmptyState type="coding" action={{ label: "Log a problem to track topics", onClick: () => setQuickLogOpen(true) }} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topicStats.map(t => (
                  <TopicCard key={t.topic} topic={t.topic} count={t.count} lastActivity={t.lastActivity} />
                ))}
              </div>
            )}
          </div>
          
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
          <div className="pt-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Problems</h2>
            {loading ? (
              <div className="space-y-3"><SkeletonRow /><SkeletonRow /></div>
            ) : recentProblems.length === 0 ? (
              <EmptyState type="coding" />
            ) : (
              <RecentProblems
                problems={recentProblems}
                onClick={setSelectedProblem}
              />
            )}
          </div>
        </div>
      </div>

      {selectedProblem && (
        <CodingDrawer
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
          onUpdate={update}
          onDelete={remove}
        />
      )}
    </div>
  );
}
