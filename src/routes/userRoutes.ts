import express from "express";
import * as userController from "../controllers/userController";
import { validate } from "../middlewares/validate";
import * as userValidation from "../validations/userValidation";
import { authMiddleware } from "../middlewares/authenticate";

const router = express.Router();

/**
 * Authentication Routes
 */
router.post("/register",validate(userValidation.registerSchema) ,userController.register);
router.post("/login",validate(userValidation.loginSchema), userController.login);

//*********************************************************Authenticated Routes************************************************************
router.use(authMiddleware);

router.get("/details", userController.getUser);


export default router;
