import asyncHandler from "express-async-handler";
import CodingProblem from "../models/CodingProblem.js";

const allowedCodingProblemUpdates = ["title", "platform", "difficulty", "topic", "solvedDate", "problemUrl"];

const pickAllowedFields = (body, allowedFields) => {
  return allowedFields.reduce((updates, field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      updates[field] = body[field];
    }
    return updates;
  }, {});
};

export const getCodingProblems = asyncHandler(async (req, res) => {
  const problems = await CodingProblem.find({ user: req.user._id }).sort({ solvedDate: -1 });
  res.json(problems);
});

export const createCodingProblem = asyncHandler(async (req, res) => {
  const problem = await CodingProblem.create({ ...req.body, user: req.user._id });
  res.status(201).json(problem);
});

export const updateCodingProblem = asyncHandler(async (req, res) => {
  const updates = pickAllowedFields(req.body, allowedCodingProblemUpdates);
  const problem = await CodingProblem.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    updates,
    { new: true, runValidators: true }
  );

  if (!problem) {
    res.status(404);
    throw new Error("Coding problem not found");
  }

  res.json(problem);
});

export const deleteCodingProblem = asyncHandler(async (req, res) => {
  const problem = await CodingProblem.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!problem) {
    res.status(404);
    throw new Error("Coding problem not found");
  }
  res.json({ message: "Coding problem deleted" });
});
