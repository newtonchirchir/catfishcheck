import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { createScan } from "../services/scan.service.js";
import { processScan } from "../services/scan-analysis.service.js";

export async function uploadImageController(
  req: AuthRequest,
  res: Response,
) {
  if (!req.userId) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      error: "Image file is required",
    });
  }

  try {
    const imageUrl = `memory://${req.file.originalname}`;

    const scan = await createScan(
      req.userId,
      imageUrl,
    );

    const mediaType =
      req.file.mimetype === "image/png"
        ? "image/png"
        : req.file.mimetype === "image/webp"
          ? "image/webp"
          : "image/jpeg";

    const analyzedScan = await processScan(
      scan.id,
      req.file.buffer,
      mediaType,
    );

    return res.status(201).json({
      message: "Scan analyzed successfully",
      scan: analyzedScan,
    });
  } catch (error) {
    console.error("Scan analysis error:", error);

    return res.status(503).json({
      error: "AI analysis unavailable",
      message:
        "The image was received, but AI analysis could not be completed.",
    });
  }
}
