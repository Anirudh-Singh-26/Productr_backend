import { body } from "express-validator";

const loginValidator = [
  body("email").optional().isEmail().withMessage("Invalid email address"),

  body("phone").optional().isMobilePhone().withMessage("Invalid phone number"),

  body().custom((value, { req }) => {
    if (!req.body.email && !req.body.phone) {
      throw new Error("Email or phone number is required");
    }

    return true;
  }),
];

const verifyOTPValidator = [
  body("identifier").notEmpty().withMessage("Identifier is required"),

  body("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits"),
];

const resendOTPValidator = [
  body("identifier").notEmpty().withMessage("Identifier is required"),
];

export { loginValidator, verifyOTPValidator, resendOTPValidator };
