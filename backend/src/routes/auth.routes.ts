import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import cloudinary from "../config/cloudinary";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authenticate as any, authController.me as any);
router.post("/logout", authController.logout);

export default router;
