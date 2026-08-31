import express from "express";
import { addFavorite, getMyFavorites, removeFavorite } from "../controllers/favoriteController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, addFavorite);
router.get("/", verifyToken, getMyFavorites);
router.delete("/:id", verifyToken, removeFavorite);

export default router;