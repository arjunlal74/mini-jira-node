import { Request, Response } from "express";
import prisma from "../config/database";
import UserRole from "../enums/userRoles";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { TestJob } from "../jobs/TestJob";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import { log } from "console";

export const register = catchAsync(async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("User with this email already exists", 400);
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
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });
  
  if (!user) {
    throw new AppError("Invalid email", 404);
  }
  console.log('userssssssssssssssssssssssssssssssssssssssssssss',user);
  

  let userPassword: string | null | undefined;
  let isPasswordValid: boolean;

  if (user.role === UserRole.MEMBER && user.isFirstLogin) {
    userPassword = user.tempPassword;
    isPasswordValid = password === userPassword;
  } else {
    userPassword = user.password;
    isPasswordValid = await bcrypt.compare(password, user.password as string);
  }

  if (!isPasswordValid) {
    throw new AppError("Incorrect credentials", 422);
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any }
  );

  return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
  });
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
  res.json({
    user: req.user,
  });
});

export const createMember = catchAsync(async (req: Request, res: Response) => {
  const { name, email } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("User with this email already exists", 400);
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
});

export const test = catchAsync(async (req: Request, res: Response) => {
  console.log("this is testing route.......................");

  TestJob.dispatchMisc({userId: 1});        // misc

  res.json({
    message : "this is testing route"
  });
});
