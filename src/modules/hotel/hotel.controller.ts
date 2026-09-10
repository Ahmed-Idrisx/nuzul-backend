import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { errorResponse, successResponse } from "../../utils/api-response.js";
import { createHotel, getHotelById, listHotels } from "./hotel.service.js";

// Registers a new hotel for the authenticated user
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

// get all hotels
export async function getHotels(req: AuthRequest, res: Response) {
  try {
    const hotels = await listHotels();

    return successResponse(res, "Hotels fetched successfully", hotels);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, 500, "Failed to fetch hotels", error.message);
    }

    return errorResponse(
      res,
      500,
      "Internal server error",
      "Something went wrong",
    );
  }
}

// get hotel by id
export async function getHotelDetails(req: AuthRequest, res: Response) {
  try {
    const hotel = await getHotelById(req.params.id as string);

    return successResponse(res, "Hotel fetched successfully", [hotel]);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Hotel not found") {
        return errorResponse(res, 404, "Hotel not found", error.message);
      }

      return errorResponse(res, 500, "Failed to fetch hotel", error.message);
    }

    return errorResponse(
      res,
      500,
      "Internal server error",
      "Something went wrong",
    );
  }
}
