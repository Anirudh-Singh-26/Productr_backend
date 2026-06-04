import Product from "../models/Product.js";
import { sendSuccess, sendError } from "../utils/responseUtils.js";


const getAllProducts = async (req, res, next) => {
  try {
    const {
      status,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy   = "createdAt",
      order    = "desc",
    } = req.query;

    const filter = {
      user: req.user._id,
    };

    if (status)   filter.status   = status;
    if (category) filter.category = new RegExp(category, "i");

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const sortOrder  = order === "asc" ? 1 : -1;
    const sortField  = ["price", "productName", "createdAt", "quantity"].includes(sortBy)
      ? sortBy
      : "createdAt";

      const products = await Product.find(filter)
        .sort({ [sortField]: sortOrder })
        .lean();

    return sendSuccess(res, 200, "Products fetched successfully", {
      products,
    });
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).lean();

    if (!product) {
      return sendError(res, 404, "Product not found");
    }

    return sendSuccess(res, 200, "Product fetched successfully", { product });
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const productData = { ...req.body };
    productData.user = req.user._id;

    if (req.files && req.files.length > 0) {
      productData.images = req.files.map((f) => f.path);
    }

    const product = await Product.create(productData);

    return sendSuccess(res, 201, "Product created successfully", { product });
  } catch (err) {
    console.dir(err, { depth: null });
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    const updates = { ...req.body };

    let existingImages = [];

    if (updates.existingImages) {
      existingImages = JSON.parse(updates.existingImages);
    }

    const newImages = req.files?.map((file) => file.path) || [];

    updates.images = [...existingImages, ...newImages];

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    return sendSuccess(res, 200, "Product updated successfully", { product: updated });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return sendError(res, 404, "Product not found");
    }

    await product.deleteOne();

    return sendSuccess(res, 200, "Product deleted successfully", {
      deletedId: req.params.id,
    });
  } catch (err) {
    next(err);
  }
};

const updateProductStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    ).lean();

    if (!product) {
      return sendError(res, 404, "Product not found");
    }

    return sendSuccess(res, 200, `Product ${status} successfully`, {
      product,
    });
  } catch (err) {
    next(err);
  }
};

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
};
