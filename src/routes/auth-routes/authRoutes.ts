import express from "express";
import { userSignupController } from "../../controllers/auth-controllers/user.signup";
import { userSigninController } from "../../controllers/auth-controllers/user.signin";
import { userLogoutControler } from "../../controllers/auth-controllers/user.logout";
import { protect } from "../../middlewares/authMiddlware";
import { userProfileController } from "../../controllers/auth-controllers/user.manage";
const router = express.Router();

router.route("/signup").post(userSignupController);
router.route("/signin").post(userSigninController);
router.route("/logout").post(userLogoutControler);
router.route("/profile").get(protect, userProfileController);

export default router;
