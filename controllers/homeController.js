import Recipe from "../models/Recipe.js";
import User from "../models/User.js";

export const getHomeData = async (req, res) => {
  try {
    const totalRecipes = await Recipe.countDocuments();
    const totalUsers = await User.countDocuments();

    const [featuredRecipes, trendingRecipes] = await Promise.all([
      Recipe.find({ isFeatured: true }).sort({ updatedAt: -1 }).limit(6),
      Recipe.find().sort({ likesCount: -1 }).limit(6),
    ]);

    res.status(200).json({
      success: true,
      stats: { totalRecipes, totalUsers },
      featuredRecipes,
      popularRecipes: trendingRecipes,
    });
  } catch (error) {
    console.error("❌ Home Data Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};