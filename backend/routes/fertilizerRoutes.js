import express from "express";
import {
  getFertilizerRecommendation,
  getFertilizerHistory,
} from "../controllers/fertilizerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/recommend",
  protect,
  authorizeRoles("farmer"),
  getFertilizerRecommendation
);

router.get(
  "/history",
  protect,
  authorizeRoles("farmer"),
  getFertilizerHistory
);

export default router;