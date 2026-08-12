import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },

  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const filename = `${crypto.randomUUID()}${extension}`;

    cb(null, filename);
  },
});

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb,
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error("Only JPEG, PNG, and WebP images are allowed"),
    );
  }

  cb(null, true);
};

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
