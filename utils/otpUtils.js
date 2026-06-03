import crypto from "crypto";

const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

const getOTPExpiry = (
  minutes = Number(process.env.OTP_EXPIRY_MINUTES) || 10,
) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

const isOTPValid = (otpExpiry) => {
  if (!otpExpiry) return false;

  return new Date() < new Date(otpExpiry);
};

const sendOTP = async (recipient, otp) => {
  console.log(`OTP for ${recipient}: ${otp}`);
  return true;
};

export { generateOTP, getOTPExpiry, isOTPValid, sendOTP };