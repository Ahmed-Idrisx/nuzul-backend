import { Response } from "express";

import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { errorResponse, successResponse } from "../../utils/api-response.js";

import { createHotel } from "./hotel.service.js";

export async function registerHotel(req: AuthRequest, res: Response) {
  try {
    await createHotel(req.userId!, req.body, req.file);

    return successResponse(res, "Hotel created successfully", [], 201);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, 400, "Failed to create hotel", error.message);
    }

    return errorResponse(
      res,
      500,
      "Internal server error",
      "Something went wrong",
    );
  }
}
