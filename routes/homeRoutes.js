import express from "express";
import { getHomeData } from "../controllers/homeController.js";

const router = express.Router();

router.get("/", getHomeData);

export default router;