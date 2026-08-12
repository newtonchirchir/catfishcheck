import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { uploadImage } from "../middleware/upload.middleware.js";
import { uploadImageController } from "../controllers/upload.controller.js";

const router = Router();

router.post(
  "/",
  authenticate,
  uploadImage.single("image"),
  uploadImageController,
);

export default router;
