import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authMiddleware";

export const authorizeRoles = (...roles: string[]) => {
  console.log(roles);
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    //TODO User is already existing, no need for this
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized: No user information found",
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log(req.user.role);
      return res.status(403).json({
        message: "Forbidden: You do not have access to this resource",
      });
    }

    next();
  };
};
