import asyncHandler from "express-async-handler";
import CodingProblem from "../models/CodingProblem.js";
import Goal from "../models/Goal.js";
import Note from "../models/Note.js";
import Placement from "../models/Placement.js";
import StudySession from "../models/StudySession.js";
import Task from "../models/Task.js";

const startOfDay = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const dateKey = (date) => date.toISOString().slice(0, 10);

const buildDailySeries = (items, dateField, valueFn, days = 7) => {
  const today = startOfDay();
  const buckets = Array.from({ length: days }, (_, index) => {
    const date = addDays(today, index - (days - 1));
    return { date: dateKey(date), value: 0 };
  });

  items.forEach((item) => {
    const key = dateKey(new Date(item[dateField]));
    const bucket = buckets.find((entry) => entry.date === key);
    if (bucket) bucket.value += valueFn(item);
  });

  return buckets;
};

const calculateCodingStreak = (problems) => {
  const solvedDates = new Set(problems.map((problem) => dateKey(new Date(problem.solvedDate))));
  let streak = 0;
  let cursor = startOfDay();

  while (solvedDates.has(dateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
};

export const getAnalytics = asyncHandler(async (req, res) => {
  const [tasks, studySessions, placements, codingProblems, notes, goals] = await Promise.all([
    Task.find({ user: req.user._id }),
    StudySession.find({ user: req.user._id }),
    Placement.find({ user: req.user._id }),
    CodingProblem.find({ user: req.user._id }),
    Note.find({ user: req.user._id }),
    Goal.find({ user: req.user._id })
  ]);

  const today = startOfDay();
  const tomorrow = addDays(today, 1);
  const todayTasks = tasks.filter((task) => {
    const due = new Date(task.dueDate);
    return due >= today && due < tomorrow;
  });
  const completedTasks = tasks.filter((task) => task.status === "Completed").length;
  const totalStudyHours = studySessions.reduce((sum, session) => sum + session.duration, 0);
  const offers = placements.filter((item) => item.status === "Offer").length;
  const interviews = placements.filter((item) => ["Interview", "Offer", "Rejected"].includes(item.status)).length;
  const productivityScore = Math.min(
    100,
    Math.round((completedTasks * 5) + (totalStudyHours * 2) + (codingProblems.length * 3) + (offers * 15))
  );

  const difficultyDistribution = ["Easy", "Medium", "Hard"].map((difficulty) => ({
    name: difficulty,
    value: codingProblems.filter((problem) => problem.difficulty === difficulty).length
  }));

  res.json({
    summary: {
      todayTasks: todayTasks.length,
      studyHours: totalStudyHours,
      codingStreak: calculateCodingStreak(codingProblems),
      placementProgress: placements.length ? Math.round((offers / placements.length) * 100) : 0,
      notesCount: notes.length,
      productivityScore,
      goalsCount: goals.length
    },
    placement: {
      totalApplications: placements.length,
      successRate: placements.length ? Math.round((offers / placements.length) * 100) : 0,
      interviewRate: placements.length ? Math.round((interviews / placements.length) * 100) : 0
    },
    charts: {
      studyHours: buildDailySeries(studySessions, "sessionDate", (session) => session.duration),
      codingProgress: buildDailySeries(codingProblems, "solvedDate", () => 1),
      tasksCompleted: buildDailySeries(
        tasks.filter((task) => task.status === "Completed"),
        "updatedAt",
        () => 1
      ),
      placementActivity: buildDailySeries(placements, "applicationDate", () => 1),
      difficultyDistribution
    }
  });
});
