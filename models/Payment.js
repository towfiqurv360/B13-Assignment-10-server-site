import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }, 
    transactionId: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    paidAt: { type: Date, default: Date.now },
  }
);

export default mongoose.model("Payment", paymentSchema);