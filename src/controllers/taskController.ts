import { Request, Response } from "express";
import prisma from "../config/database";
import crypto from "crypto";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

export const createTask = catchAsync(async (req: Request, res: Response) => {
  const { name, description, projectId } = req.body;

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      merchantId: req.user.id,
    },
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const task = await prisma.task.create({
    data: {
      name,
      description,
      projectId: projectId,
      uuid: `tk_${crypto.randomBytes(8).toString("hex")}`,
    },
  });

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: task,
  });
});

export const assignTask = catchAsync(async (req: Request, res: Response) => {
  res.json({
    message: "this is assign task route",
  });
});
