import { Response, NextFunction } from "express";
import { ResponseFormat } from "../../../types/public-types/resFormat.type";
import asyncHandler from "../../../utils/asyncHandler";
import { IRequest } from "../../../types/authTypes";
import { permissionLetterService } from "../../../services/eventService";

export const permisionLetterController = asyncHandler(
  async (req: IRequest, res: Response<ResponseFormat>, next: NextFunction) => {
    const userId: string = `${req.user?.id}`;

    await permissionLetterService(req.body, userId, next);

    res
      .status(201)
      .json({ success: true, message: "Doc created", statusCode: 201 });
  }
);
