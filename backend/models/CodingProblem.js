import mongoose from "mongoose";

const codingProblemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    platform: {
      type: String,
      enum: ["LeetCode", "Codeforces", "HackerRank", "GeeksForGeeks"],
      required: true
    },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    topic: { type: String, required: true, trim: true },
    solvedDate: { type: Date, default: Date.now },
    problemUrl: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("CodingProblem", codingProblemSchema);
