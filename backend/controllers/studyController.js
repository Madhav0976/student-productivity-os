import asyncHandler from "express-async-handler";
import StudySession from "../models/StudySession.js";

const allowedStudySessionUpdates = ["subject", "topic", "duration", "completed", "notes", "sessionDate"];

const pickAllowedFields = (body, allowedFields) => {
  return allowedFields.reduce((updates, field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      updates[field] = body[field];
    }
    return updates;
  }, {});
};

export const getStudySessions = asyncHandler(async (req, res) => {
  const sessions = await StudySession.find({ user: req.user._id }).sort({ sessionDate: -1 });
  res.json(sessions);
});

export const createStudySession = asyncHandler(async (req, res) => {
  const session = await StudySession.create({ ...req.body, user: req.user._id });
  res.status(201).json(session);
});

export const updateStudySession = asyncHandler(async (req, res) => {
  const updates = pickAllowedFields(req.body, allowedStudySessionUpdates);
  const session = await StudySession.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    updates,
    { new: true, runValidators: true }
  );

  if (!session) {
    res.status(404);
    throw new Error("Study session not found");
  }

  res.json(session);
});

export const deleteStudySession = asyncHandler(async (req, res) => {
  const session = await StudySession.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!session) {
    res.status(404);
    throw new Error("Study session not found");
  }
  res.json({ message: "Study session deleted" });
});
