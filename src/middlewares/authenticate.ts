import { Request, Response, NextFunction } from "express";
import prisma from "../config/database";

import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
  email: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1️⃣ Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    // 2️⃣ Extract token
    // Format: Bearer <token>
    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: {
        email: decoded.email,
      },
    });

    const userReqData = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    // 4️⃣ Attach user to request
    req.user = userReqData;

    // 5️⃣ Continue
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
