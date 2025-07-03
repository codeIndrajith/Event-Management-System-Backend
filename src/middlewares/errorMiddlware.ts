import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../utils/errorResponse";
import { Prisma } from "@prisma/client";
import { ResponseFormat } from "../types/public-types/resFormat.type";

interface ErrorWithCode extends Error {
  code?: number;
  statusCode?: number;
  meta?: any;
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
    switch (err.code) {
      case "P1001":
        error = new ErrorResponse(
          "Cannot reach the database server. Please ensure it is running and accessible.",
          503
        );
        break;
      case "P2002":
        const targetFields = err.meta?.target?.join(", ") || "fields";
        error = new ErrorResponse(`Duplicate entry for ${targetFields}`, 409);
        break;
      case "P2025":
        error = new ErrorResponse("Record not found", 404);
        break;
      case "P2003":
        error = new ErrorResponse("Foreign key constraint failed", 400);
        break;
      case "P2016":
        error = new ErrorResponse("Required field missing", 400);
        break;
      default:
        // Handle validation errors (like missing required fields)
        if (
          err.message.includes("Argument") &&
          err.message.includes("is missing")
        ) {
          const missingField =
            err.message.match(/Argument `(.+?)` is missing/)?.[1] || "field";
          error = new ErrorResponse(
            `Missing required field: ${missingField}`,
            400
          );
        } else {
          error = new ErrorResponse("Database operation failed", 500);
        }
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    // Handle validation errors (like type mismatches)
    error = new ErrorResponse("Invalid data format provided", 400);
  }

  res.status(error.statusCode ?? 500).json({
    success: false,
    statusCode: error.statusCode ?? 500,
    error: error.message || "Server Error",
  });
};
