import Joi from 'joi';

export const createTaskSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().min(6).optional(),
  projectId: Joi.number().integer().required()
});
