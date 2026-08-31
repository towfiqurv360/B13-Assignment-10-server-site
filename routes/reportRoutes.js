import express from "express";
import { createReport, getAllReports, deleteReport } from "../controllers/reportController.js";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createReport);
router.get("/", verifyToken, verifyAdmin, getAllReports);
router.delete("/:id", verifyToken, verifyAdmin, deleteReport);

export default router;