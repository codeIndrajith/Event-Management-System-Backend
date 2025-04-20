import express from "express";
import { EventController } from "../../controllers/Event-controllers/EventController";
import { authorize, protect } from "../../middlewares/authMiddlware";
const router = express.Router();

router.route("/create").post(protect, authorize("Organizer"), EventController);

export default router;
