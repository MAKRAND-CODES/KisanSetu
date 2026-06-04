import express from "express";
import {
  createMarketPrice,
  getAllMarketPrices,
  getPricesByCrop,
  getRealMandiPrices,
  updateMarketPrice,
  deleteMarketPrice,
} from "../controllers/marketController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/real", protect, getRealMandiPrices);

router.post("/", protect, authorizeRoles("admin"), createMarketPrice);

router.get("/", protect, getAllMarketPrices);

router.get("/crop/:cropName", protect, getPricesByCrop);

router.put("/:id", protect, authorizeRoles("admin"), updateMarketPrice);

router.delete("/:id", protect, authorizeRoles("admin"), deleteMarketPrice);

export default router;