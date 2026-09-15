import { NextFunction, Request, Response } from "express";

import { successResponse } from "../../utils/api-response.js";
import {
  loginUser,
  otpVerify,
  passwordReset,
  registerUser,
  sendResetOtp,
} from "./auth.service.js";
import { env } from "../../config/env.js";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await registerUser(req.body);

    return successResponse(
      res,
      "Registration successful. Please check your email for the verification code.",
      [],
      201,
    );
  } catch (error) {
    next(error);
  }
}

export async function verifyOtp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await otpVerify(req.body);

    return successResponse(res, "Email verified successfully", [], 200);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { user, token } = await loginUser(req.body);

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "none",
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
    next(error);
  }
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await sendResetOtp(req.body);

    return successResponse(
      res,
      "If this email exists, an OTP has been sent.",
      [],
      200,
    );
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await passwordReset(req.body);

    return successResponse(res, "Password reset successfully", [], 200);
  } catch (error) {
    next(error);
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "none",
  });

  return successResponse(res, "Logged out successfully", []);
}
