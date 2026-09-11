import { NextFunction, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { successResponse } from "../../utils/api-response.js";
import { createHotel, getHotelById, listHotels } from "./hotel.service.js";

// Registers a new hotel for the authenticated user
export async function registerHotel(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    await createHotel(req.userId!, req.body, req.file);

    return successResponse(res, "Hotel created successfully", [], 201);
  } catch (error) {
    next(error);
  }
}

// get all hotels
export async function getHotels(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const hotels = await listHotels();

    return successResponse(res, "Hotels fetched successfully", hotels);
  } catch (error) {
    next(error);
  }
}

// get hotel by id
export async function getHotelDetails(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const hotel = await getHotelById(req.params.id as string);

    return successResponse(res, "Hotel fetched successfully", [hotel]);
  } catch (error) {
    next(error);
  }
}
