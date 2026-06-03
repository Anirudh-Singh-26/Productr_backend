import { Router } from "express";

import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
} from "../controllers/productController.js";

import {
  createProductValidator,
  updateProductValidator,
  updateStatusValidator,
  getProductsValidator,
  productIdValidator,
} from "../validators/productValidator.js";

import { validate } from "../middleware/validationMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { handleProductImageUpload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(getProductsValidator, validate, getAllProducts)
  .post(
    handleProductImageUpload,
    createProductValidator,
    validate,
    createProduct,
  );

router
  .route("/:id")
  .get(productIdValidator, validate, getProductById)
  .put(
    handleProductImageUpload,
    updateProductValidator,
    validate,
    updateProduct,
  )
  .delete(productIdValidator, validate, deleteProduct);

router
  .route("/:id/status")
  .patch(updateStatusValidator, validate, updateProductStatus);

export default router;
