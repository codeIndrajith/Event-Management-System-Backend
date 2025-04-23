import { Request, Response, NextFunction } from "express";
import { ResponseFormat } from "../../types/public-types/resFormat.type";
import asyncHandler from "../../utils/asyncHandler";
import { IRequest } from "../../types/authTypes";
import {
  eventService,
  getAllEventService,
  getEventService,
  getOwnerEventService,
} from "../../services/eventService";

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
  async (req: Request, res: Response<ResponseFormat>, next: NextFunction) => {
    const allEvents = await getAllEventService(next);

    res.status(200).json({ success: true, statusCode: 200, data: allEvents });
  }
);

const getEventController = asyncHandler(
  async (req: Request, res: Response<ResponseFormat>, next: NextFunction) => {
    const eventId: string = `${req.params.eventId}`;
    const event = await getEventService(next, eventId);
    res.status(200).json({ success: true, statusCode: 200, data: event });
  }
);

const getOwnerEventsController = asyncHandler(
  async (req: IRequest, res: Response<ResponseFormat>, next: NextFunction) => {
    const userId: string = `${req.user?.id}`;

    const ownerEvent = await getOwnerEventService(next, userId);

    res.status(200).json({ success: true, statusCode: 200, data: ownerEvent });
  }
);

export {
  EventController,
  getAllEventController,
  getEventController,
  getOwnerEventsController,
};
