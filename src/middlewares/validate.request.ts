import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { errorResponse } from "../utils/api-response.js";

export const validateRequest = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errorMessages = result.error.issues.map((err) => err.message);

      return errorResponse(
        res,
        400,
        "Validation failed",
        errorMessages.join(", "),
      );
    }

    req.body = result.data;

    next();
  };
};
