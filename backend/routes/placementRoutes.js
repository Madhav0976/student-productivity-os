import express from "express";
import {
  createPlacement,
  deletePlacement,
  getPlacements,
  updatePlacement
} from "../controllers/placementController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getPlacements).post(protect, createPlacement);
router.route("/:id").put(protect, updatePlacement).delete(protect, deletePlacement);

export default router;
