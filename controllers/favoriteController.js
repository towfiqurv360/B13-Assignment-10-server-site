import Favorite from "../models/Favorite.js";


export const addFavorite = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { recipeId } = req.body;


    const alreadyExists = await Favorite.findOne({ userId, recipeId });
    if (alreadyExists) {
      return res.status(400).json({ message: "Recipe is already in your favorites" });
    }

    const newFavorite = new Favorite({
      userId,
      userEmail: req.user.email,
      recipeId,
    });

    await newFavorite.save();
    res.status(201).json({ message: "Added to favorites successfully", favorite: newFavorite });
  } catch (error) {
    console.error("❌ Add Favorite Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getMyFavorites = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    
    const favorites = await Favorite.find({ userId }).populate("recipeId").sort({ createdAt: -1 });
    res.status(200).json(favorites);
  } catch (error) {
    console.error("❌ Get Favorites Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findByIdAndDelete(req.params.id);
    if (!favorite) return res.status(404).json({ message: "Favorite not found" });
    res.status(200).json({ message: "Removed from favorites" });
  } catch (error) {
    console.error("❌ Remove Favorite Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};