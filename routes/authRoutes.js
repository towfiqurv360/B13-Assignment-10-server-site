import express from "express";
import { registerUser, loginUser, googleLogin, logoutUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);
router.post("/logout", logoutUser);

export default router;