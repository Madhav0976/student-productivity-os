import mongoose from "mongoose";

const placementSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    applicationDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Dream", "Applied", "OA", "Interview", "HR", "Offer", "Rejected"],
      default: "Applied"
    },
    notes: { type: String, default: "" },
    salary: { type: String, default: "" },
    location: { type: String, default: "" },
    url: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Placement", placementSchema);
