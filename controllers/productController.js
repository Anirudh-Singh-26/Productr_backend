import fs      from "fs";
import path    from "path";
import Product from "../models/Product.js";
import { sendSuccess, sendError } from "../utils/responseUtils.js";
import cloudinary from "../config/cloudinary.js";


const getAllProducts = async (req, res, next) => {
  try {
    const {
      page     = 1,
      limit    = 10,
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

    const skip       = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder  = order === "asc" ? 1 : -1;
    const sortField  = ["price", "productName", "createdAt", "quantity"].includes(sortBy)
      ? sortBy
      : "createdAt";

    const [products, total] = await Promise.all([
      Product.find({
        user: req.user._id,
      })
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, "Products fetched successfully", {
      products,
      pagination: {
        total,
        page:       parseInt(page),
        limit:      parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();

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

    if (typeof productData.weight === "string") {
      productData.weight = JSON.parse(productData.weight);
    }
    if (typeof productData.dimensions === "string") {
      productData.dimensions = JSON.parse(productData.dimensions);
    }

    const product = await Product.create(productData);

    return sendSuccess(res, 201, "Product created successfully", { product });
  } catch (err) {
    console.dir(error, { depth: null });
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!product) {
      if (req.files && req.files.length > 0) {
        deleteImageFiles(req.files.map((f) => f.path));
      }
      return sendError(res, 404, "Product not found");
    }

    const updates = { ...req.body };

    let existingImages = [];

    if (updates.existingImages) {
      existingImages = JSON.parse(updates.existingImages);
    }

    const newImages = req.files?.map((file) => file.path) || [];

    updates.images = [...existingImages, ...newImages];

    if (typeof updates.weight === "string") {
      updates.weight = JSON.parse(updates.weight);
    }
    if (typeof updates.dimensions === "string") {
      updates.dimensions = JSON.parse(updates.dimensions);
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    return sendSuccess(res, 200, "Product updated successfully", { product: updated });
  } catch (err) {
    if (req.files && req.files.length > 0) {
      deleteImageFiles(req.files.map((f) => f.path));
    }
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
