import express from "express";
import * as userController from "../controllers/userController";
import { validate } from "../middlewares/validate";
import * as userValidation from "../validations/userValidation";

const router = express.Router();

/**
 * Authentication Routes
 */
router.post("/register",validate(userValidation.registerSchema) ,userController.register);
router.post("/login",validate(userValidation.loginSchema), userController.login);

export default router;
