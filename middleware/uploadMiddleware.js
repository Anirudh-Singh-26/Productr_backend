import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const fileFilter = (_req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, PNG and WEBP images are allowed"), false);
  }
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "products",
    };
  },
});

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
});

const uploadProductImages = upload.array("images", 10);

const handleProductImageUpload = (req, res, next) => {

  uploadProductImages(req, res, (err) => {
    if (err) {
      if (err.error) {
        console.error("Nested Error:");
        console.dir(err.error, { depth: null });
      }

      return next(err);
    }
    next();
  });
};

export { handleProductImageUpload };
