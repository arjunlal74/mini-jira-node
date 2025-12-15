import * as projectController from "../controllers/projectController";
import { requireMerchant } from "../middlewares/requireMerchant";
import * as userController from "../controllers/userController";
import * as taskController from "../controllers/taskController";
import * as userValidation from "../validations/userValidation";
import * as projectValidation from "../validations/projectValidation";
import { authMiddleware } from "../middlewares/authenticate";
import { validate } from "../middlewares/validate";
import express from "express";

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
router.use(requireMerchant); //middleware

router.post(
  "/create-member",
  validate(userValidation.createMemberSchema),
  userController.createMember
);

/**
 * Project Routes
 */
router.post(
  "/project",
  validate(projectValidation.createProjectSchema),
  projectController.createProject
);

/**
 * Task Routes
 */
router.post(
  "/task",
  validate(userValidation.createMemberSchema),
  taskController.createTask
);

export default router;
