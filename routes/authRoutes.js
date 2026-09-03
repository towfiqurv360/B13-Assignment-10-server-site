import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { registerUser, loginUser, googleLogin, logoutUser, getCurrentUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);
router.get("/me", verifyToken, getCurrentUser);
router.post("/logout", logoutUser);

export default router;