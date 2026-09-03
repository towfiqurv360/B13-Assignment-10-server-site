import Recipe from "../models/Recipe.js";
import User from "../models/User.js";

// Add new recipe
export const createRecipe = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id; 

    if (!userId) {
      return res.status(400).json({ message: "User ID missing from token" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }

    // Check recipe limit for normal users
    if (!user.isPremium) {
      const userRecipeCount = await Recipe.countDocuments({ authorId: userId });
      if (userRecipeCount >= 2) {
        return res.status(403).json({ message: "Normal users can only add up to 2 recipes. Please upgrade to premium." });
      }
    }

    const newRecipe = new Recipe({
      ...req.body,
      authorId: user._id,
      authorName: user.name,
      authorEmail: user.email,
    });

    await newRecipe.save();
    res.status(201).json({ message: "Recipe created successfully", recipe: newRecipe });
  } catch (error) {
    console.error("❌ Recipe Add Error: ", error); 
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all recipes with optional filtering and Server-Side Pagination
export const getAllRecipes = async (req, res) => {
  try {
    
    const { category, page = 1, limit = 9 } = req.query; 
    let query = {};

    // Filter Recipes Using Category with MongoDB $in[cite: 1]
    if (category) {
      const categoriesArray = category.split(",");
      query.category = { $in: categoriesArray };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    
    const recipes = await Recipe.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

   
    const totalRecipes = await Recipe.countDocuments(query);
    const totalPages = Math.ceil(totalRecipes / parseInt(limit));

    
    res.status(200).json({
      recipes,
      currentPage: parseInt(page),
      totalPages,
      totalRecipes
    });
  } catch (error) {
    console.error("❌ Get All Recipes Error: ", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single recipe details & Increment watchCount
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $inc: { watchCount: 1 } },
      { new: true }
    );

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    console.error("❌ Get Recipe By ID Error: ", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user's own recipes
export const getMyRecipes = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const recipes = await Recipe.find({ authorId: userId }).sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    console.error("❌ Get My Recipes Error: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a recipe (owner or admin)
export const updateRecipe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    if (recipe.authorId.toString() !== userId.toString() && user?.role !== "admin") {
      return res.status(403).json({ message: "You are not allowed to edit this recipe" });
    }
    const allowed = ["recipeName", "recipeImage", "category", "cuisineType", "difficultyLevel", "preparationTime", "ingredients", "instructions"];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    const updated = await Recipe.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.status(200).json({ message: "Recipe updated successfully", recipe: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a recipe (owner or admin)
export const deleteRecipe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    if (recipe.authorId.toString() !== userId.toString() && user?.role !== "admin") {
      return res.status(403).json({ message: "You are not allowed to delete this recipe" });
    }
    await recipe.deleteOne();
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Recipe Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle Like logic (Like/Unlike)
export const toggleLike = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    
    const hasLiked = recipe.likedBy?.includes(userId);

    if (hasLiked) {
      
      recipe.likedBy = recipe.likedBy.filter(id => id !== userId);
      recipe.likesCount = Math.max(0, recipe.likesCount - 1);
    } else {
      
      recipe.likedBy.push(userId);
      recipe.likesCount += 1;
    }

    await recipe.save();
    res.status(200).json({ message: hasLiked ? "Unliked" : "Liked", likesCount: recipe.likesCount });
  } catch (error) {
    console.error("❌ Toggle Like Error: ", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Toggle Feature Recipe for Home Page
export const toggleFeatureRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    recipe.isFeatured = !recipe.isFeatured;
    await recipe.save();

    res.status(200).json({ 
        message: recipe.isFeatured ? "Recipe featured successfully" : "Recipe removed from featured",
        isFeatured: recipe.isFeatured
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};