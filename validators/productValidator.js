import { body, param, query } from "express-validator";

const createProductValidator = [
  body("productName")
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ max: 200 })
    .withMessage("Product name must not exceed 200 characters")
    .trim(),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),

  body("mrp")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("MRP must be a non-negative number"),

  body("exchangeEligibility")
    .optional()
    .isIn(["Yes", "No"])
    .withMessage("Exchange eligibility must be Yes or No"),

  body("category").notEmpty().withMessage("Category is required").trim(),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer"),
    
  body("status")
    .optional()
    .isIn(["published", "unpublished"])
    .withMessage("Status must be 'published' or 'unpublished'"),
];

const updateProductValidator = [
  param("id").isMongoId().withMessage("Invalid product ID"),

  ...createProductValidator,
];

const updateStatusValidator = [
  param("id").isMongoId().withMessage("Invalid product ID"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["published", "unpublished"])
    .withMessage("Status must be 'published' or 'unpublished'"),
];

const getProductsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("status")
    .optional()
    .isIn(["published", "unpublished"])
    .withMessage("Status must be 'published' or 'unpublished'"),

  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("minPrice must be a non-negative number"),

  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("maxPrice must be a non-negative number"),
];

const productIdValidator = [
  param("id").isMongoId().withMessage("Invalid product ID"),
];

export {
  createProductValidator,
  updateProductValidator,
  updateStatusValidator,
  getProductsValidator,
  productIdValidator,
};
