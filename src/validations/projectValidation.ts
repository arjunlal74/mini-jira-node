import Joi from "joi";

// Reset password validation
export const createProjectSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().min(6).required(),
});
