import express from "express";
import {
  EventController,
  FilterVenueController,
  getAllEventController,
  getEventController,
  getOwnerEventsController,
  publishedEventController,
} from "../../controllers/Event-controllers/EventController";
import { authorize, protect } from "../../middlewares/authMiddlware";
const router = express.Router();

router.route("/create").post(protect, authorize("Organizer"), EventController);
router
  .route("/publish")
  .put(protect, authorize("Organizer"), publishedEventController);
router
  .route("/owner")
  .get(protect, authorize("Organizer"), getOwnerEventsController);
router.route("/").get(getAllEventController);
router
  .route("/filter-venue")
  .get(protect, authorize("Organizer"), FilterVenueController);
router.route("/:eventId").get(getEventController);

export default router;
