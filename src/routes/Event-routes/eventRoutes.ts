import express from "express";
import { permisionLetterController } from "../../controllers/Event-controllers/Permission-controllers/PermissionDocControllers";
import { authorize, protect } from "../../middlewares/authMiddlware";
const router = express.Router();

router
  .route("/create")
  .post(protect, authorize("Admin"), permisionLetterController);

export default router;
