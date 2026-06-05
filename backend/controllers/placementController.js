import asyncHandler from "express-async-handler";
import Placement from "../models/Placement.js";

const allowedPlacementUpdates = ["companyName", "role", "applicationDate", "status", "notes"];

const pickAllowedFields = (body, allowedFields) => {
  return allowedFields.reduce((updates, field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      updates[field] = body[field];
    }
    return updates;
  }, {});
};

export const getPlacements = asyncHandler(async (req, res) => {
  const placements = await Placement.find({ user: req.user._id }).sort({ applicationDate: -1 });
  res.json(placements);
});

export const createPlacement = asyncHandler(async (req, res) => {
  const placement = await Placement.create({ ...req.body, user: req.user._id });
  res.status(201).json(placement);
});

export const updatePlacement = asyncHandler(async (req, res) => {
  const updates = pickAllowedFields(req.body, allowedPlacementUpdates);
  const placement = await Placement.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    updates,
    { new: true, runValidators: true }
  );

  if (!placement) {
    res.status(404);
    throw new Error("Placement entry not found");
  }

  res.json(placement);
});

export const deletePlacement = asyncHandler(async (req, res) => {
  const placement = await Placement.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!placement) {
    res.status(404);
    throw new Error("Placement entry not found");
  }
  res.json({ message: "Placement entry deleted" });
});
