import { NextFunction, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { successResponse } from "../../utils/api-response.js";
import {
  bookingRoom,
  checkRoomAvailability,
  statusUpdateBooking,
} from "./booking.service.js";

export async function checkAvailability(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const isAvailable = await checkRoomAvailability(req.body);

    return successResponse(
      res,
      "Room is available",
      [{ isAvailable: isAvailable }],
      200,
    );
  } catch (error) {
    next(error);
  }
}

export async function createBooking(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    await bookingRoom(req.userId!, req.body);

    return successResponse(
      res,
      "Booking created successfully, check your email for more information",
      [],
      201,
    );
  } catch (error) {
    next(error);
  }
}

export async function updateBookingStatus(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const booking = await statusUpdateBooking(
      req.userId!,
      req.params.bookingId as string,
      req.body,
    );

    return successResponse(
      res,
      "Booking status updated successfully",
      [booking],
      200,
    );
  } catch (error) {
    next(error);
  }
}
