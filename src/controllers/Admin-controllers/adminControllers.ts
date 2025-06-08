import { addVenuService } from "../../services/adminService";
import { IRequest } from "../../types/authTypes";
import { ResponseFormat } from "../../types/public-types/resFormat.type";
import asyncHandler from "../../utils/asyncHandler";
import { Response, NextFunction } from "express";

const VenuController = asyncHandler(
  async (req: IRequest, res: Response<ResponseFormat>, next: NextFunction) => {
    const userId: string = `${req.user?.id}`;

    const isVenuAdd = await addVenuService(req.body, userId, next);

    if (isVenuAdd) {
      res.status(201).json({
        success: isVenuAdd,
        statusCode: 201,
        message: "Venu created",
      });
    }
  }
);

export { VenuController };
