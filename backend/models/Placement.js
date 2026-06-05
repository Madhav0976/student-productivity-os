import mongoose from "mongoose";

const placementSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    applicationDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Applied", "OA Completed", "Interview", "Rejected", "Offer"],
      default: "Applied"
    },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Placement", placementSchema);
