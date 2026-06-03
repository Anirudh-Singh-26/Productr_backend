import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name must not exceed 200 characters"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
    },

    mrp: {
      type: Number,
      min: [0, "MRP must be a positive number"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    brand: {
      type: String,
      trim: true,
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },

    images: {
      type: [String],
      default: [],
    },

    exchangeEligibility: {
      type: String,
      enum: ["Yes", "No"],
      default: "Yes",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: {
        values: ["published", "unpublished"],
        message: "Status must be either 'published' or 'unpublished'",
      },
      default: "unpublished",
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index({
  productName: "text",
});

productSchema.index({
  category: 1,
});

productSchema.index({
  status: 1,
});

const Product = mongoose.model("Product", productSchema);

export default Product;
