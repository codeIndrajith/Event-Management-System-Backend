import express from "express";
import { userSignupController } from "../../controllers/auth-controllers/user.signup";
const router = express.Router();

router.route("/signup").post(userSignupController);

export default router;
