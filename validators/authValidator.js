import { body } from "express-validator";

const loginValidator = [
  body("email")
    .optional()
    .isEmail()
    .withMessage("Provide a valid email address")
    .normalizeEmail(),

  body("phone")
    .optional()
    .matches(/^\+?[1-9]\d{7,14}$/)
    .withMessage("Provide a valid phone number"),

  body().custom((_, { req }) => {
    if (!req.body.email && !req.body.phone) {
      throw new Error("Either email or phone number is required");
    }

    return true;
  }),
];

const verifyOTPValidator = [
  body("identifier")
    .notEmpty()
    .withMessage("Email or phone number is required")
    .trim(),

  body("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 digits")
    .isNumeric()
    .withMessage("OTP must contain digits only"),
];

const resendOTPValidator = [
  body("identifier")
    .notEmpty()
    .withMessage("Email or phone number is required")
    .trim(),
];

export { loginValidator, verifyOTPValidator, resendOTPValidator };
