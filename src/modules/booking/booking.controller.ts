import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { errorResponse, successResponse } from "../../utils/api-response.js";
import { bookingRoom, checkRoomAvailability } from "./booking.service.js";

export async function checkAvailability(req: AuthRequest, res: Response) {
  try {
    // const { roomId, checkInDate, checkOutDate } = req.body;

    await checkRoomAvailability(req.body);

    return successResponse(res, "Room is available", [], 200);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(
        res,
        400,
        "Failed to check room availability",
        error.message,
      );
    }

    return errorResponse(
      res,
      500,
      "Internal server error",
      "Something went wrong",
    );
  }
}

export async function createBooking(req: AuthRequest, res: Response) {
  try {
    await bookingRoom(req.userId!, req.body);

    return successResponse(
      res,
      "Booking created successfully, check your email for more information",
      [],
      201,
    );
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, 400, "Failed to create booking", error.message);
    }

    return errorResponse(
      res,
      500,
      "Internal server error",
      "Something went wrong",
    );
  }
}
