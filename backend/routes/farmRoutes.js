import express from "express";
import {
  createFarm,
  getMyFarms,
  getSingleFarm,
  updateFarm,
  deleteFarm,
} from "../controllers/farmController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("farmer"), createFarm);
router.get("/my", protect, authorizeRoles("farmer"), getMyFarms);
router.get("/:id", protect, authorizeRoles("farmer"), getSingleFarm);
router.put("/:id", protect, authorizeRoles("farmer"), updateFarm);
router.delete("/:id", protect, authorizeRoles("farmer"), deleteFarm);

export default router;