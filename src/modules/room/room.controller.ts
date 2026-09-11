import { NextFunction, Response } from "express";

import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { successResponse } from "../../utils/api-response.js";

import { roomCreator, roomAvailabilityToggler } from "./room.service.js";

export async function createRoom(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    await roomCreator(req.userId!, req.body, files);

    return successResponse(res, "Room created successfully", [], 201);
  } catch (error) {
    next(error);
  }
}

export async function toggleRoomAvailability(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const room = await roomAvailabilityToggler(req.userId!, req.body);

    return successResponse(
      res,
      "Room availability updated successfully",
      [room],
      200,
    );
  } catch (error) {
    next(error);
  }
}
