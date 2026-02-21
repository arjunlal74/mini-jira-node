import { Request, Response } from "express";
import prisma from "../config/database";
import { ProjectFilters } from "../filters/ProjectFilter";
import crypto from "crypto";
import { catchAsync } from "../utils/catchAsync";

export const createProject = catchAsync(async (req: Request, res: Response) => {
  const { name, description } = req.body;

  const project = await prisma.project.create({
    data: {
      name,
      description,
      merchantId: req.user.id,
      uuid: `pr_${crypto.randomBytes(8).toString("hex")}`,
    },
  });

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    data: project,
  });
});

export const getProjects = catchAsync(async (req: Request, res: Response) => {
  const filters = new ProjectFilters(req.query);
  const where = filters.apply();

  const projects = await prisma.project.findMany({
    where,
  });

  res.status(200).json({
    success: true,
    data: projects,
  });
});
