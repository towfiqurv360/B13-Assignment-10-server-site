import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true },
    reporterEmail: { type: String, required: true },
    reason: { type: String, required: true, enum: ["Spam", "Offensive Content", "Copyright Issue"] },
    status: { type: String, default: "pending" }, // pending, dismissed, removed
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model("Report", reportSchema);