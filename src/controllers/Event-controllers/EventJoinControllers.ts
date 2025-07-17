import { Response, NextFunction } from "express";
import { IRequest } from "../../types/authTypes";
import { ResponseFormat } from "../../types/public-types/resFormat.type";
import asyncHandler from "../../utils/asyncHandler";
import { eventJoinService } from "../../services/joinEventServices";

const eventJoinController = asyncHandler(
  async (req: IRequest, res: Response<ResponseFormat>, next: NextFunction) => {
    const user = req.user;

    const joinUserMsg = await eventJoinService(next, req.body, user);

    res
      .status(200)
      .json({ success: true, statusCode: 200, message: joinUserMsg });
  }
);

export { eventJoinController };
