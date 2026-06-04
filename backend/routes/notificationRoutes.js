import express from "express";
import {
  createNotification,
  getMyNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("admin", "officer"),
  createNotification
);

router.get("/my", protect, authorizeRoles("farmer"), getMyNotifications);

router.put(
  "/:id/read",
  protect,
  authorizeRoles("farmer"),
  markNotificationAsRead
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("farmer"),
  deleteNotification
);

export default router;