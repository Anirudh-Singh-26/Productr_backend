import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    phone: {
      type: String,
      trim: true,
      sparse: true,
      match: [/^\+?[1-9]\d{7,14}$/, "Invalid phone number format"],
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpiry: {
      type: Date,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("validate", function (next) {
  if (!this.email && !this.phone) {
    return next(new Error("Either email or phone number is required"));
  }

  next();
});

userSchema.index(
  { email: 1 },
  {
    unique: true,
    sparse: true,
  },
);

userSchema.index(
  { phone: 1 },
  {
    unique: true,
    sparse: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
