import { Request, Response } from "express";
import prisma from "../config/database";
import crypto from "crypto";

export const createTask = async (req: Request, res: Response) => {
  const { name, description, projectId } = req.body;

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      merchantId: req.user.id,
    },
  });

  if (!project) {
    res.status(404).json({
      success: false,
      message: "Project not found",
    });
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
};

export const assignTask = (req: Request, res: Response) => {
  res.json({
    message: "this is assign task route",
  });
};
