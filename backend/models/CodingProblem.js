import mongoose from "mongoose";

const codingProblemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    platform: {
      type: String,
      enum: ["LeetCode", "Codeforces", "HackerRank", "GeeksForGeeks", "CodeChef", "AtCoder", "Other"],
      required: true
    },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    topic: { type: String, required: true, trim: true },
    language: { type: String, default: "" },
    notes: { type: String, default: "" },
    solvedDate: { type: Date, default: Date.now },
    url: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("CodingProblem", codingProblemSchema);
