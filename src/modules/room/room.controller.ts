import { Response } from "express";

import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { errorResponse, successResponse } from "../../utils/api-response.js";

import { roomCreator } from "./room.service.js";

export async function createRoom(req: AuthRequest, res: Response) {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    await roomCreator(req.userId!, req.body, files);

    return successResponse(res, "Room created successfully", [], 201);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, 400, "Failed to create room", error.message);
    }

    return errorResponse(
      res,
      500,
      "Internal server error",
      "Something went wrong",
    );
  }
}
