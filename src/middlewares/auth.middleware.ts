import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { errorResponse } from "../utils/api-response.js";

interface JwtPayload {
  userId: string;
}

export interface AuthRequest extends Request {
  userId?: string;
}

export function protect(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken;

  if (!token) {
    return errorResponse(res, 401, "Not authorized to access", "UNAUTHORIZED");
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    req.userId = decoded.userId;

    return next();
  } catch {
    return errorResponse(res, 401, "Invalid or expired token", "UNAUTHORIZED");
  }
}
