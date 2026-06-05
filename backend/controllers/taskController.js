import asyncHandler from "express-async-handler";
import Task from "../models/Task.js";

const allowedTaskUpdates = ["title", "description", "priority", "dueDate", "status"];

const pickAllowedFields = (body, allowedFields) => {
  return allowedFields.reduce((updates, field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      updates[field] = body[field];
    }
    return updates;
  }, {});
};

export const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, search } = req.query;
  const query = { user: req.user._id };

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (search) query.$or = [
    { title: { $regex: search, $options: "i" } },
    { description: { $regex: search, $options: "i" } }
  ];

  const tasks = await Task.find(query).sort({ dueDate: 1, createdAt: -1 });
  res.json(tasks);
});

export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({ ...req.body, user: req.user._id });
  res.status(201).json(task);
});

export const updateTask = asyncHandler(async (req, res) => {
  const updates = pickAllowedFields(req.body, allowedTaskUpdates);
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    updates,
    { new: true, runValidators: true }
  );

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.json(task);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.json({ message: "Task deleted" });
});
