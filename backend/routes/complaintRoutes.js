import express from "express";
import {
  createComplaint,
  getMyComplaints,
  getSingleComplaint,
  getAllComplaints,
  updateComplaintStatus,
} from "../controllers/complaintController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("farmer"), createComplaint);
router.get("/my", protect, authorizeRoles("farmer"), getMyComplaints);

router.get(
  "/",
  protect,
  authorizeRoles("officer", "admin"),
  getAllComplaints
);

router.get("/:id", protect, getSingleComplaint);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("officer", "admin"),
  updateComplaintStatus
);

export default router;