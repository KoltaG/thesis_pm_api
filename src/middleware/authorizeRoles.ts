import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authMiddleware";

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log("User in authorizeRoles:", req.user);
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized: No user information found",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden: You do not have access to this resource",
      });
    }

    next();
  };
};
