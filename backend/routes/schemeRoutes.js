import express from "express";
import {
  seedSchemes,
  getAllSchemes,
  getSingleScheme,
  checkEligibility,
  createScheme,
  updateScheme,
  deleteScheme,
} from "../controllers/schemeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/seed", protect, authorizeRoles("admin"), seedSchemes);

router.get("/", protect, getAllSchemes);
router.get("/:id", protect, getSingleScheme);

router.post(
  "/check-eligibility",
  protect,
  authorizeRoles("farmer"),
  checkEligibility
);

router.post("/", protect, authorizeRoles("admin"), createScheme);
router.put("/:id", protect, authorizeRoles("admin"), updateScheme);
router.delete("/:id", protect, authorizeRoles("admin"), deleteScheme);

export default router;