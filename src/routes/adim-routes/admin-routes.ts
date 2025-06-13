import express from "express";
import { authorize, protect } from "../../middlewares/authMiddlware";
import {
  ApprovedEventController,
  VenuController,
} from "../../controllers/Admin-controllers/adminControllers";
const router = express.Router();

router.route("/create-venu").post(protect, authorize("Admin"), VenuController);
router
  .route("/event/approve")
  .put(protect, authorize("Admin"), ApprovedEventController);

export default router;
