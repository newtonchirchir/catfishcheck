import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as { userId?: string };

    if (!decoded.userId) {
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    req.userId = decoded.userId;

    next();
  } catch {
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
}
