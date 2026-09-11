import { NextFunction, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { successResponse } from "../../utils/api-response.js";
import { addSearchedCity, getCurrentUser, updateUser } from "./user.service.js";

export async function getMe(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await getCurrentUser(req.userId!);

    return successResponse(res, "Current user retrieved successfully", [user]);
  } catch (error) {
    next(error);
  }
}

export async function updateMe(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await updateUser(req.userId!, req.body, req.file);

    const { password, imageId, ...safeUser } = user;

    return successResponse(res, "User updated successfully", [safeUser]);
  } catch (error) {
    next(error);
  }
}

export async function storeRecentSearchedCities(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const searchedCities = await addSearchedCity(req.userId!, req.body);

    return successResponse(res, "Recent city added successfully", [
      searchedCities,
    ]);
  } catch (error) {
    next(error);
  }
}
