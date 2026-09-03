import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

// Route Imports
import homeRoutes from "./routes/homeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: ["http://localhost:3000" ,"https://b13-assignment-10-recipehub.vercel.app"],
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/home", homeRoutes);

app.get("/", (req, res) => {
  res.send("RecipeHub Server is Running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});