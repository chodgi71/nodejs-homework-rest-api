import express from "express";
import authController from "../../controllers/auth-controller.js";
import validates from "../../middleware/validation/contact-validation.js";

const authRouter = express.Router();

authRouter.post("/register", validates.userSignupValidate, authController.signup);

authRouter.post("/login", validates.userSigninValidate, authController.signin);

export default authRouter;
