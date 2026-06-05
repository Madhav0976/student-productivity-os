import express from "express";
import {
  createCodingProblem,
  deleteCodingProblem,
  getCodingProblems,
  updateCodingProblem
} from "../controllers/codingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getCodingProblems).post(protect, createCodingProblem);
router.route("/:id").put(protect, updateCodingProblem).delete(protect, deleteCodingProblem);

export default router;
