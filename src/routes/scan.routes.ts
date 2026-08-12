import { Router } from "express";
import {
  createScanController,
  getScanController,
  getUserScansController,
} from "../controllers/scan.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/", createScanController);
router.get("/", getUserScansController);
router.get("/:id", getScanController);

export default router;
