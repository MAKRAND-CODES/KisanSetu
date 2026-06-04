import express from "express";
import {
  getCropRecommendations,
  getCropRecommendationHistory,
} from "../controllers/cropController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/recommend", protect, authorizeRoles("farmer"), getCropRecommendations);
router.get("/history", protect, authorizeRoles("farmer"), getCropRecommendationHistory);

export default router;