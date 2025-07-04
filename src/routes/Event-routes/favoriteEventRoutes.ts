import express from "express";
import { authorize, protect } from "../../middlewares/authMiddlware";
import {
  addFavoriteEventController,
  getuserAddedFavoriteEventController,
  removeAddedFavoriteEventController,
} from "../../controllers/Event-controllers/EventController";

const router = express.Router();

router
  .route("/new")
  .post(protect, authorize("Participant"), addFavoriteEventController);
router
  .route("/remove/:eventId")
  .delete(
    protect,
    authorize("Participant"),
    removeAddedFavoriteEventController
  );
router
  .route("/user-events")
  .get(protect, authorize("Participant"), getuserAddedFavoriteEventController);

export default router;
