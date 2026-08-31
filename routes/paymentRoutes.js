import express from "express";
import { 
  createPaymentIntent, 
  savePayment, 
  getPurchasedRecipes, 
  getAllPayments 
} from "../controllers/paymentController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-payment-intent", verifyToken, createPaymentIntent);
router.post("/", verifyToken, savePayment);
router.get("/purchased", verifyToken, getPurchasedRecipes); 

router.get("/all", verifyToken, getAllPayments); 

export default router;