import express from "express";
import { authorize, protect } from "../../middlewares/authMiddlware";
import { eventJoinController } from "../../controllers/Event-controllers/EventJoinControllers";

const router = express.Router();

router
  .route("/create")
  .post(protect, authorize("Participant"), eventJoinController);

export default router;
