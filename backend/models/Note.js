import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "" },
    category: {
      type: String,
      enum: ["College", "Placement", "DSA", "Project", "Personal"],
      default: "Personal"
    },
    tags: { type: [String], default: [] },
    isPinned: { type: Boolean, default: false },
    isFavorite: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
