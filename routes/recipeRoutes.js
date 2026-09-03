import express from "express";
import { 
  createRecipe, 
  getAllRecipes, 
  getRecipeById, 
  getMyRecipes, 
  deleteRecipe,
  updateRecipe,
  toggleLike,
  toggleFeatureRecipe 
} from "../controllers/recipeController.js";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.js"; // <-- verifyAdmin 

const router = express.Router();

router.post("/", verifyToken, createRecipe);
router.get("/", getAllRecipes);
router.get("/my-recipes", verifyToken, getMyRecipes);
router.get("/:id", getRecipeById);
router.patch("/:id", verifyToken, updateRecipe);
router.delete("/:id", verifyToken, deleteRecipe);
router.patch("/:id/like", verifyToken, toggleLike); 
router.patch("/:id/feature", verifyToken, verifyAdmin, toggleFeatureRecipe);

export default router;