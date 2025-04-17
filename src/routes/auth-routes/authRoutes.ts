import express from "express";
import { userSignupController } from "../../controllers/auth-controllers/user.signup";
import { userSigninController } from "../../controllers/auth-controllers/user.signin";
const router = express.Router();

router.route("/signup").post(userSignupController);
router.route("/signin").post(userSigninController);

export default router;
