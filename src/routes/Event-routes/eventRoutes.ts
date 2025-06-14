import express from "express";
import {
  EventController,
  FilterVenueController,
  getAllPublishedEventController,
  getPublishedEventController,
  getOwnerAllEventsController,
  publishedEventController,
  getOwnerEventController,
} from "../../controllers/Event-controllers/EventController";
import { authorize, protect } from "../../middlewares/authMiddlware";
const router = express.Router();

router.route("/create").post(protect, authorize("Organizer"), EventController);
router
  .route("/publish")
  .put(protect, authorize("Organizer"), publishedEventController);
router
  .route("/owner")
  .get(protect, authorize("Organizer"), getOwnerAllEventsController);

router
  .route("/owner/:eventId")
  .get(protect, authorize("Organizer"), getOwnerEventController);
router.route("/").get(getAllPublishedEventController);
router
  .route("/filter-venue")
  .get(protect, authorize("Organizer"), FilterVenueController);
router.route("/:eventId").get(getPublishedEventController);

export default router;
