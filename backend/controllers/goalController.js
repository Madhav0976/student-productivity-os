import asyncHandler from "express-async-handler";
import Goal from "../models/Goal.js";

const allowedGoalUpdates = ["goalName", "targetDate", "progressPercentage", "status"];

const pickAllowedFields = (body, allowedFields) => {
  return allowedFields.reduce((updates, field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      updates[field] = body[field];
    }
    return updates;
  }, {});
};

export const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id }).sort({ targetDate: 1 });
  res.json(goals);
});

export const createGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.create({ ...req.body, user: req.user._id });
  res.status(201).json(goal);
});

export const updateGoal = asyncHandler(async (req, res) => {
  const updates = pickAllowedFields(req.body, allowedGoalUpdates);
  const goal = await Goal.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    updates,
    { new: true, runValidators: true }
  );

  if (!goal) {
    res.status(404);
    throw new Error("Goal not found");
  }

  res.json(goal);
});

export const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!goal) {
    res.status(404);
    throw new Error("Goal not found");
  }
  res.json({ message: "Goal deleted" });
});
