import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (!(err instanceof AppError)) {
    // If it's an unexpected error, we can log it here.
    console.error("💥 ERROR:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
