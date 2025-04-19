import { ErrorResponse } from "../utils/errorResponse";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Response } from "express";
import { IRequest } from "../types/authTypes";
import { verifyToken } from "../utils/generateToken";

const prisma = new PrismaClient();

// Protect Routes
export const protect = async (
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string = "";

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  //   Make sure token exists
  if (!token) {
    throw new ErrorResponse("Not Authorized to access this routes", 401);
  }

  const { id } = verifyToken(token);
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }

  const { password, ...userWithoutPassword } = user;
  req.user = userWithoutPassword;
  next();
};

export const authorize = (...roles: string[]) => {
  return (req: IRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user?.role)) {
      return next(
        new ErrorResponse(
          `${req.user?.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
