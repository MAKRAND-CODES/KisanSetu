import express from "express";
import {
  getCurrentWeather,
  getFarmWeather,
} from "../controllers/weatherController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/current", protect, authorizeRoles("farmer"), getCurrentWeather);
router.get("/farm/:farmId", protect, authorizeRoles("farmer"), getFarmWeather);

export default router;