import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.api
  .ping()
  .then((res) => {
    console.log("========== CLOUDINARY PING ==========");
    console.log(res);
    console.log("=====================================");
  })
  .catch((err) => {
    console.error("========== CLOUDINARY PING FAILED ==========");
    console.dir(err, { depth: null });
    console.error("============================================");
  });

export default cloudinary;
