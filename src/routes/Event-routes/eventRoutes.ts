import express from "express";
import {
  EventController,
  FilterVenueController,
  getAllEventController,
  getEventController,
  getOwnerEventsController,
} from "../../controllers/Event-controllers/EventController";
import { authorize, protect } from "../../middlewares/authMiddlware";
const router = express.Router();

router.route("/create").post(protect, authorize("Organizer"), EventController);
router.route("/").get(getAllEventController);
router
  .route("/filter-venue")
  .get(protect, authorize("Organizer"), FilterVenueController);
router.route("/:eventId").get(getEventController);
router
  .route("/owner")
  .get(protect, authorize("Organizer"), getOwnerEventsController);

export default router;
