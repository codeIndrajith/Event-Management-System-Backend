import express from "express";
import { authorize, protect } from "../../middlewares/authMiddlware";
import { addFavoriteEventController } from "../../controllers/Event-controllers/EventController";

const router = express.Router();

router
  .route("/create")
  .post(protect, authorize("Participant"), addFavoriteEventController);

export default router;
