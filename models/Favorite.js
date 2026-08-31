import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true },
    addedAt: { type: Date, default: Date.now },
  }
);

export default mongoose.model("Favorite", favoriteSchema);