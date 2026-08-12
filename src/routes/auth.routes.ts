import { Router } from "express";
import {
  registerUser,
  loginUser,
} from "../services/auth.service.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters",
      });
    }

    const result = await registerUser(
      email,
      password,
      name,
    );

    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Registration failed",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const result = await loginUser(email, password);

    return res.json(result);
  } catch {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }
});

export default router;
