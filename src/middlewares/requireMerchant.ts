import { Request, Response, NextFunction } from 'express';
import UserRole from '../enums/userRoles';

export const requireMerchant = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // authMiddleware must run before this
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    if (req.user.role !== UserRole.MERCHANT) {
      return res.status(403).json({
        success: false,
        message: 'Only merchants can access this resource'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Merchant authorization failed'
    });
  }
};
