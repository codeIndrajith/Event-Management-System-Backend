import express from "express";
import { authorize, protect } from "../../middlewares/authMiddlware";
import { VenuController } from "../../controllers/Admin-controllers/adminControllers";
const router = express.Router();

router.route("/create-venu").post(protect, authorize("Admin"), VenuController);

export default router;
