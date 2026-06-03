import User from "../models/User.js";
import {
  generateOTP,
  getOTPExpiry,
  isOTPValid,
  sendOTP,
} from "../utils/otpUtils.js";

import { sendSuccess, sendError } from "../utils/responseUtils.js";

import { generateToken } from "../utils/jwtUtils.js";

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, phone } = req.body;

    const identifier = email || phone;
    const field = email ? "email" : "phone";

    let user = await User.findOne({
      [field]: identifier,
    });

    if (!user) {
      user = await User.create({
        [field]: identifier,
      });
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpiry = getOTPExpiry();

    await user.save();

    await sendOTP(identifier, otp);

    return sendSuccess(res, 200, "OTP sent successfully", {
      identifier,
      otp,
      expiresInMinutes: Number(process.env.OTP_EXPIRY_MINUTES) || 10,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/verify-otp
const verifyOTP = async (req, res, next) => {
  try {
    const { identifier, otp } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return sendError(res, 404, "No account found for this identifier");
    }

    if (!user.otp || !isOTPValid(user.otpExpiry)) {
      return sendError(res, 410, "OTP has expired. Please request a new one");
    }

    if (user.otp !== otp) {
      return sendError(res, 401, "Incorrect OTP");
    }

    user.otp = null;
    user.otpExpiry = null;
    user.isVerified = true;

    await user.save();

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(res, 200, "OTP verified successfully", {
      user: {
        id: user._id,
        identifier,
        isVerified: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/resend-otp
const resendOTP = async (req, res, next) => {
  try {
    const { identifier } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return sendError(res, 404, "No account found for this identifier");
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpiry = getOTPExpiry();

    await user.save();

    await sendOTP(identifier, otp);

    return sendSuccess(res, 200, "New OTP sent successfully", {
      identifier,
      otp,
      expiresInMinutes: Number(process.env.OTP_EXPIRY_MINUTES) || 10,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  return sendSuccess(
    res,
    200,
    "User fetched successfully",
    {
      user: {
        id: req.user._id,
        email: req.user.email,
        phone: req.user.phone,
        isVerified: req.user.isVerified,
      },
    }
  );
};

// POST /api/auth/logout
const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return sendSuccess(
    res,
    200,
    "Logged out successfully"
  );
};

export { login, verifyOTP, resendOTP, getMe, logout };