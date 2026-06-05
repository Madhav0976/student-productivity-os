import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    goalName: { type: String, required: true, trim: true },
    targetDate: { type: Date, required: true },
    progressPercentage: { type: Number, min: 0, max: 100, default: 0 },
    status: { type: String, enum: ["Not Started", "In Progress", "Completed"], default: "Not Started" }
  },
  { timestamps: true }
);

export default mongoose.model("Goal", goalSchema);
