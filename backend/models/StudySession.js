import mongoose from "mongoose";

const studySessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true, trim: true },
    topic: { type: String, required: true, trim: true },
    duration: { type: Number, required: true, min: 0 },
    completed: { type: Boolean, default: false },
    notes: { type: String, default: "" },
    sessionDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("StudySession", studySessionSchema);
