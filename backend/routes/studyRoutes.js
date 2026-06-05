import express from "express";
import {
  createStudySession,
  deleteStudySession,
  getStudySessions,
  updateStudySession
} from "../controllers/studyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getStudySessions).post(protect, createStudySession);
router.route("/:id").put(protect, updateStudySession).delete(protect, deleteStudySession);

export default router;
