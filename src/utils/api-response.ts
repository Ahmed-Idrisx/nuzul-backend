import { Response } from "express";

type ApiStatus = "success" | "error";

interface ApiResponse<T> {
  status: ApiStatus;
  message: string;
  error: string;
  data: T[];
}

export function successResponse<T>(
  res: Response,
  message: string,
  data: T[] = [],
  statusCode = 200,
) {
  return res.status(statusCode).json({
    status: "success",
    message,
    error: "",
    data,
  } satisfies ApiResponse<T>);
}

export function errorResponse(
  res: Response,
  statusCode: number,
  message: string,
  error: string,
) {
  return res.status(statusCode).json({
    status: "error",
    message,
    error,
    data: [],
  });
}
