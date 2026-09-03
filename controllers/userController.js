import User from "../models/User.js";
import Recipe from "../models/Recipe.js";
import Favorite from "../models/Favorite.js";
import Report from "../models/Report.js";
import mongoose from "mongoose";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const user = await User.findById(userId).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Get Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { name, image } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, image },
      { new: true }
    ).select("-password");

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("❌ Update Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Get All Users Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle Block/Unblock User
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

  
    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({ 
        message: user.isBlocked ? "User blocked successfully" : "User unblocked successfully",
        isBlocked: user.isBlocked
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isPremium } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { role, isPremium } },
      { new: true }
    ).select("-password");
    
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("❌ Update User Role Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const [user, totalRecipes, totalFavorites, likedRecipes] = await Promise.all([
      User.findById(userId).select("name email role image isPremium"),
      Recipe.countDocuments({ authorId: userId }),
      Favorite.countDocuments({ userId }),
      Recipe.aggregate([
        { $match: { authorId: new mongoose.Types.ObjectId(userId.toString()) } },
        { $group: { _id: null, likesReceived: { $sum: "$likesCount" } } }
      ]),
    ]);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin") {
      const [totalUsers, allRecipes, premiumMembers, totalReports] = await Promise.all([
        User.countDocuments(),
        Recipe.countDocuments(),
        User.countDocuments({ isPremium: true }),
        Report.countDocuments(),
      ]);
      return res.status(200).json({ user, stats: { totalUsers, totalRecipes: allRecipes, premiumMembers, totalReports } });
    }

    res.status(200).json({
      user,
      stats: {
        totalRecipes,
        totalFavorites,
        likesReceived: likedRecipes[0]?.likesReceived || 0,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
