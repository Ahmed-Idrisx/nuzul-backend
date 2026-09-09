import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { errorResponse, successResponse } from "../../utils/api-response.js";
import { addSearchedCity, getCurrentUser, updateUser } from "./user.service.js";

export async function getMe(req: AuthRequest, res: Response) {
  try {
    const user = await getCurrentUser(req.userId!);

    return successResponse(res, "Current user retrieved successfully", [user]);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, 404, error.message, error.message);
    }

    return errorResponse(
      res,
      500,
      "Internal server error",
      "Something went wrong",
    );
  }
}

export async function updateMe(req: AuthRequest, res: Response) {
  try {
    const user = await updateUser(req.userId!, req.body, req.file);

    const { password, imageId, ...safeUser } = user;

    return successResponse(res, "User updated successfully", [safeUser]);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(
        res,
        400,
        "Failed to update your data",
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

export async function storeRecentSearchedCities(
  req: AuthRequest,
  res: Response,
) {
  try {
    const searchedCities = await addSearchedCity(req.userId!, req.body);

    return successResponse(res, "Recent city added successfully", [
      searchedCities,
    ]);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, 400, error.message, "ADD_RECENT_CITY_FAILED");
    }

    return errorResponse(
      res,
      500,
      "Internal server error",
      "Something went wrong",
    );
  }
}
