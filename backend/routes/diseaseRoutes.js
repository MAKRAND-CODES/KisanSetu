import express from "express";
import {
  detectDisease,
  getMyDiseaseReports,
  getSingleDiseaseReport,
  getAllDiseaseReports,
} from "../controllers/diseaseController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/detect",
  protect,
  authorizeRoles("farmer"),
  upload.any(),
  detectDisease
);

router.get("/my", protect, authorizeRoles("farmer"), getMyDiseaseReports);

router.get(
  "/all",
  protect,
  authorizeRoles("officer", "admin"),
  getAllDiseaseReports
);

router.get("/:id", protect, getSingleDiseaseReport);

export default router;