import { Router } from "express";

import {
  login,
  verifyOTP,
  resendOTP,
  getMe,
  logout,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

import {
  loginValidator,
  verifyOTPValidator,
  resendOTPValidator,
} from "../validators/authValidator.js";

import { validate } from "../middleware/validationMiddleware.js";

const router = Router();

router.post("/login", loginValidator, validate, login);

router.post("/verify-otp", verifyOTPValidator, validate, verifyOTP);

router.post("/resend-otp", resendOTPValidator, validate, resendOTP);

router.get("/me", protect, getMe);

router.post("/logout", protect, logout);

export default router;
