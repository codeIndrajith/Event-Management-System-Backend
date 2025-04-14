import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../utils/errorResponse";
import { Prisma } from "@prisma/client";
import { ResponseFormat } from "../types/public-types/resFormat.type";

interface ErrorWithCode extends Error {
  code?: number;
  statusCode?: number;
}

export const errorHandler = (
  err: ErrorWithCode,
  req: Request,
  res: Response<ResponseFormat>,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;
  console.log(error);

  // Handle prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const message = `Duplicate entry for ${err.meta?.target}`;
      error = new ErrorResponse(message, 409);
    } else if (err.code === "P2025") {
      const message = "Record not found";
      error = new ErrorResponse(message, 404);
    } else {
      const message = "Database operation failed";
      error = new ErrorResponse(message, 500);
    }
  }

  res.status(error.statusCode ?? 500).json({
    success: false,
    statusCode: error.statusCode ?? 500,
    error: error.message || "Server Error",
  });
};
