import asyncHandler from "express-async-handler";
import Note from "../models/Note.js";

const allowedNoteUpdates = ["title", "content", "category"];

const pickAllowedFields = (body, allowedFields) => {
  return allowedFields.reduce((updates, field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      updates[field] = body[field];
    }
    return updates;
  }, {});
};

export const getNotes = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const query = { user: req.user._id };

  if (category) query.category = category;
  if (search) query.$or = [
    { title: { $regex: search, $options: "i" } },
    { content: { $regex: search, $options: "i" } }
  ];

  const notes = await Note.find(query).sort({ updatedAt: -1 });
  res.json(notes);
});

export const createNote = asyncHandler(async (req, res) => {
  const note = await Note.create({ ...req.body, user: req.user._id });
  res.status(201).json(note);
});

export const updateNote = asyncHandler(async (req, res) => {
  const updates = pickAllowedFields(req.body, allowedNoteUpdates);
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    updates,
    { new: true, runValidators: true }
  );

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  res.json(note);
});

export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }
  res.json({ message: "Note deleted" });
});
