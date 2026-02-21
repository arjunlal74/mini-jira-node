import { Response } from "express";

const isDev = process.env.NODE_ENV === "development";

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export const successResponse = <T>(
  res: Response,
  data?: T,
  message = "Success",
  statusCode = 200
) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };

  return res.status(statusCode).json(response);
};

export const errorResponse = (
  res: Response,
  message = "Server Error",
  statusCode = 500,
  error?: any
) => {
  const response: ApiResponse = {
    success: false,
    message,
    ...(isDev && error && { error }),
  };

  return res.status(statusCode).json(response);
};
