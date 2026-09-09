import { Request, Response } from "express";

import { errorResponse, successResponse } from "../../utils/api-response.js";
import { registerUser } from "./auth.service.js";

export async function register(req: Request, res: Response) {
  try {
    await registerUser(req.body);

    return successResponse(
      res,
      "Registration successful. Please check your email for the verification code.",
      [],
      201,
    );
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, 409, error.message, error.message);
    }

    return errorResponse(
      res,
      500,
      "Internal server error",
      "Something went wrong",
    );
  }
}
