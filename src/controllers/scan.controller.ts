import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import {
  createScan,
  getScanById,
  getUserScans,
} from "../services/scan.service.js";

export async function createScanController(
  req: AuthRequest,
  res: Response,
) {
  if (!req.userId) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({
      error: "imageUrl is required",
    });
  }

  const scan = await createScan(
    req.userId,
    imageUrl,
  );

  return res.status(201).json({
    message: "Scan created successfully",
    scan,
  });
}

export async function getScanController(
  req: AuthRequest,
  res: Response,
) {
  if (!req.userId) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({
      error: "Invalid scan ID",
    });
  }

  const scan = await getScanById(
    id,
    req.userId,
  );

  if (!scan) {
    return res.status(404).json({
      error: "Scan not found",
    });
  }

  return res.status(200).json({
    scan,
  });
}

export async function getUserScansController(
  req: AuthRequest,
  res: Response,
) {
  if (!req.userId) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  const scans = await getUserScans(
    req.userId,
  );

  return res.status(200).json({
    scans,
  });
}
