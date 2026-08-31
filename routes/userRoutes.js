import express from "express";
import { 
  getProfile, 
  updateProfile, 
  getAllUsers, 
  updateUserRole, 
  toggleBlockUser 
} from "../controllers/userController.js";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User Routes
router.get("/profile", verifyToken, getProfile);
router.patch("/profile", verifyToken, updateProfile);

// Admin Routes 
router.get("/", verifyToken, verifyAdmin, getAllUsers);
router.patch("/:id", verifyToken, verifyAdmin, updateUserRole);
router.patch("/:id/block", verifyToken, verifyAdmin, toggleBlockUser); 

export default router;