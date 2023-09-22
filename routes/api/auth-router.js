import express from "express";
import authController from "../../controllers/auth-controller.js";
import validates from "../../middleware/validation/contact-validation.js";
import authenticate from "../../middleware/authenticate.js";
const authRouter = express.Router();

authRouter.post("/register", validates.userSignupValidate, authController.signup);

authRouter.post("/login", validates.userSigninValidate, authController.signin);

authRouter.post("/logout", authenticate, authController.signout);

authRouter.get("/current", authenticate, authController.current);

authRouter.patch("/current", authenticate, validates.userUpdateValidate, authController.updateCurrent);

export default authRouter;
