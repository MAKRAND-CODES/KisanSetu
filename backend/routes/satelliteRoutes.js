import express from "express";
import {
  createSatelliteReport,
  createLiveNdviReport,
  getMySatelliteReports,
  getSingleSatelliteReport,
  getAllSatelliteReports,
} from "../controllers/satelliteController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/report",
  protect,
  authorizeRoles("farmer"),
  createSatelliteReport
);

router.post(
  "/live-ndvi",
  protect,
  authorizeRoles("farmer"),
  createLiveNdviReport
);

router.get("/my", protect, authorizeRoles("farmer"), getMySatelliteReports);

router.get(
  "/all",
  protect,
  authorizeRoles("officer", "admin"),
  getAllSatelliteReports
);

router.get("/:id", protect, getSingleSatelliteReport);

export default router;