import { getUsersService } from "../../services/authService";
import { IRequest } from "../../types/authTypes";
import { ResponseFormat } from "../../types/public-types/resFormat.type";
import asyncHandler from "../../utils/asyncHandler";
import { Response, NextFunction } from "express";

export const userProfileController = asyncHandler(
  async (req: IRequest, res: Response<ResponseFormat>, next: NextFunction) => {
    const user = await getUsersService(req, next);

    res.status(200).json({ success: true, statusCode: 200, data: user });
  }
);
