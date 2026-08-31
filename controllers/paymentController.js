import Stripe from "stripe";
import dotenv from "dotenv";
import Payment from "../models/Payment.js";
import User from "../models/User.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { price } = req.body;
    const amount = parseInt(price * 100); 

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("❌ Payment Intent Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const savePayment = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const paymentInfo = req.body;

    const newPayment = new Payment({
      ...paymentInfo,
      userId,
    });
    await newPayment.save();

    if (paymentInfo.paymentType === "premium") {
      await User.findByIdAndUpdate(userId, { isPremium: true });
    }

    res.status(200).json({ message: "Payment successful and saved!" });
  } catch (error) {
    console.error("❌ Save Payment Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPurchasedRecipes = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    
    const purchases = await Payment.find({ userId, paymentType: "recipe" })
      .populate("recipeId")
      .sort({ createdAt: -1 });

    res.status(200).json(purchases);
  } catch (error) {
    console.error("❌ Get Purchased Recipes Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    console.error("❌ Get All Payments Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};