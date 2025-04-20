import { Response, NextFunction } from "express";
import { ResponseFormat } from "../../types/public-types/resFormat.type";
import asyncHandler from "../../utils/asyncHandler";
import { IRequest } from "../../types/authTypes";
import { eventService, getAllEventService } from "../../services/eventService";

const EventController = asyncHandler(
  async (req: IRequest, res: Response<ResponseFormat>, next: NextFunction) => {
    const userId: string = `${req.user?.id}`;

    const isAddNotApprivedEvent = await eventService(req.body, userId, next);

    if (isAddNotApprivedEvent) {
      res.status(201).json({
        success: isAddNotApprivedEvent,
        statusCode: 201,
        message: "Event created",
      });
    }
  }
);

const getAllEventController = asyncHandler(
  async (req: IRequest, res: Response<ResponseFormat>, next: NextFunction) => {
    const allEvents = await getAllEventService(next);

    res.status(200).json({ success: true, statusCode: 200, data: allEvents });
  }
);

export { EventController, getAllEventController };
