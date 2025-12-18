import { Request, Response } from "express";
import prisma from "../config/database";
import UserRole from "../enums/userRoles";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        status: true,
        role: UserRole.MERCHANT,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userWithoutPassword,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Invalid email",
      });
    }

    let userPassword: string | null | undefined;
    let isPasswordValid: boolean;

    if (user.role === UserRole.MEMBER && user.isFirstLogin) {
      userPassword = user.tempPassword;
      isPasswordValid = (password === userPassword);
    } else {
      userPassword = user.password;
      isPasswordValid = await bcrypt.compare(password, user.password);
    }

    if (!isPasswordValid) {
      res.status(422).json({
        success: false,
        message: "Incorrect credentials",
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

export const getUser = (req: Request, res: Response) => {
  res.json({
    user: req.user,
  });
};

export const createMember = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const tempPassword = name + "minijira";

    const member = await prisma.user.create({
      data: {
        name,
        email,
        tempPassword: tempPassword,
        role: UserRole.MEMBER,
        merchantId: req.user.id,
      },
    });

    const { password: _, ...memberWithoutPassword } = member;

    res.status(201).json({
      success: true,
      message: "Member registered successfully",
      data: memberWithoutPassword,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};
