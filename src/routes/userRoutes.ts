import express from "express";
import * as userController from "../controllers/userController";
import { validate } from "../middlewares/validate";
import * as userValidation from "../validations/userValidation";
import { authMiddleware } from "../middlewares/authenticate";
import { requireMerchant } from "../middlewares/requireMerchant";

const router = express.Router();

/**
 * Authentication Routes
 */
router.post(
  "/register",
  validate(userValidation.registerSchema),
  userController.register
);
router.post(
  "/login",
  validate(userValidation.loginSchema),
  userController.login
);

//*********************************************************Authenticated Routes************************************************************
router.use(authMiddleware); //middleware

router.get("/details", userController.getUser);

//********************************************************Merchant only Routes**********************************************************
router.use(requireMerchant);//middleware

router.post(
  "/create-member",
  validate(userValidation.createMemberSchema),
  userController.createMember
);

export default router;
