import express from "express";
import { authorize, protect } from "../../middlewares/authMiddlware";
import {
  AdminDashboardPageDataController,
  ApprovedEventController,
  GetAllPendingApprovedEventController,
  GetAllVenuController,
  UpdateVenuController,
  VenuController,
} from "../../controllers/Admin-controllers/adminControllers";
const router = express.Router();

router.route("/create-venu").post(protect, authorize("Admin"), VenuController);
router
  .route("/event/approve")
  .put(protect, authorize("Admin"), ApprovedEventController);
router.route("/venues").get(protect, authorize("Admin"), GetAllVenuController);
router
  .route("/update-venue/:venueId")
  .put(protect, authorize("Admin"), UpdateVenuController);
router
  .route("/pending-approval-event")
  .get(protect, authorize("Admin"), GetAllPendingApprovedEventController);
router
  .route("/dashboard-data")
  .get(protect, authorize("Admin"), AdminDashboardPageDataController);

export default router;
