import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error.js";
import { errorResponse } from "../utils/api-response.js";
import { Prisma } from "@prisma/client";

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
}

export function globalErrorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Operational errors are trusted errors that we can handle gracefully
  if (error instanceof AppError) {
    return errorResponse(res, error.statusCode, error.message, error.message);
  }

  // Prisma known errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return errorResponse(
        res,
        409,
        "Resource already exists",
        "A record with this value already exists",
      );
    }

    if (error.code === "P2025") {
      return errorResponse(
        res,
        404,
        "Resource not found",
        "The requested resource was not found",
      );
    }
  }

  // Unexpected errors
  console.error("Unexpected error:", error);

  return errorResponse(
    res,
    500,
    "Internal server error",
    "Something went wrong",
  );
}
