import { Request, Response } from "express";

import { errorResponse, successResponse } from "../../utils/api-response.js";
import {
  getCurrentUser,
  loginUser,
  otpVerify,
  passwordReset,
  registerUser,
  sendResetOtp,
} from "./auth.service.js";
import { env } from "../../config/env.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";

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

export async function verifyOtp(req: Request, res: Response) {
  try {
    await otpVerify(req.body);

    return successResponse(res, "Email verified successfully", [], 200);
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

export async function login(req: Request, res: Response) {
  try {
    const { user, token } = await loginUser(req.body);

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, "Login successful", [
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        image: user.image,
        isVerified: user.isVerified,
      },
    ]);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, 401, error.message, error.message);
    }

    return errorResponse(
      res,
      500,
      "Internal server error",
      "Something went wrong",
    );
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    await sendResetOtp(req.body);

    return successResponse(
      res,
      "If this email exists, an OTP has been sent.",
      [],
      200,
    );
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, 500, error.message, error.message);
    }

    return errorResponse(
      res,
      500,
      "Internal server error",
      "Something went wrong",
    );
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    await passwordReset(req.body);

    return successResponse(res, "Password reset successfully", [], 200);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, 400, error.message, error.message);
    }

    return errorResponse(
      res,
      500,
      "Internal server error",
      "Something went wrong",
    );
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return successResponse(res, "Logged out successfully", []);
}

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
