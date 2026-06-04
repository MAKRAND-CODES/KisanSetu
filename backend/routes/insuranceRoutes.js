import express from "express";
import {
  applyInsurance,
  getMyInsurance,
  getAllInsurance,
  getSingleInsurance,
  updateInsuranceStatus,
} from "../controllers/insuranceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/apply", protect, authorizeRoles("farmer"), applyInsurance);
router.get("/my", protect, authorizeRoles("farmer"), getMyInsurance);

router.get(
  "/",
  protect,
  authorizeRoles("officer", "admin"),
  getAllInsurance
);

router.get("/:id", protect, getSingleInsurance);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("officer", "admin"),
  updateInsuranceStatus
);

export default router;