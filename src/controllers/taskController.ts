import { Request, Response } from "express";

export const createTask = (req: Request, res: Response) => {
   const { name, description } = req.body;

  const project = await prisma.project.create({
    data : {
        name,
        description,
        merchantId : req.user.id,
        uuid : `pr_${crypto.randomBytes(8).toString('hex')}`
    }
  });

res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
};
