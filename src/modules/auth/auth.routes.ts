import { Router } from "express";

import {
  forgotPassword,
  getMe,
  login,
  logout,
  register,
  resetPassword,
  verifyOtp,
} from "./auth.controller.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from "./auth.schema.js";
import { validateRequest } from "../../middlewares/validate.request.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/verify-otp", validateRequest(verifyOtpSchema), verifyOtp);
router.post("/login", validateRequest(loginSchema), login);
router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  forgotPassword,
);
router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  resetPassword,
);
router.post("/logout", logout);
router.get("/me", protect, getMe);
export default router;
