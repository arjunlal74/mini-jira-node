import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body is required'
      });
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,     // Show all errors
      stripUnknown: true,    // Remove unknown fields
      presence: 'required'   // Make all fields required by default
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        errors
      });
    }

    req.body = value;
    next();
  };
};