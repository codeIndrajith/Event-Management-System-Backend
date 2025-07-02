import { Request, Response, NextFunction } from "express";
import { ResponseFormat } from "../../types/public-types/resFormat.type";
import asyncHandler from "../../utils/asyncHandler";
import { IRequest } from "../../types/authTypes";
import {
  eventService,
  getAllEventService,
  getPublishedEventService,
  getOwnerAllEventService,
  publishedEventService,
  getOwnerEventService,
} from "../../services/eventService";
import { FilterOptions } from "../../types/Event-types/EventTypes";
import { filterEventService } from "../../services/adminService";
import { ErrorResponse } from "../../utils/errorResponse";

const EventController = asyncHandler(
  async (req: IRequest, res: Response<ResponseFormat>, next: NextFunction) => {
    const userId: string = `${req.user?.id}`;

    const response = await eventService(req.body, userId, next);

    console.log(response);

    if (response?.success) {
      res.status(201).json({
        success: response?.success,
        statusCode: 201,
        message: "Event created",
        data: response?.eventId,
      });
    }
  }
);

const getAllPublishedEventController = asyncHandler(
  async (req: Request, res: Response<ResponseFormat>, next: NextFunction) => {
    const allEvents = await getAllEventService(next);

    res.status(200).json({ success: true, statusCode: 200, data: allEvents });
  }
);

const getPublishedEventController = asyncHandler(
  async (req: Request, res: Response<ResponseFormat>, next: NextFunction) => {
    const eventId: string = `${req.params.eventId}`;
    const event = await getPublishedEventService(next, eventId);
    res.status(200).json({ success: true, statusCode: 200, data: event });
  }
);

const getOwnerAllEventsController = asyncHandler(
  async (req: IRequest, res: Response<ResponseFormat>, next: NextFunction) => {
    const userId: string = `${req.user?.id}`;

    const ownerEvents = await getOwnerAllEventService(next, userId);

    res.status(200).json({ success: true, statusCode: 200, data: ownerEvents });
  }
);

const getOwnerEventController = asyncHandler(
  async (req: IRequest, res: Response<ResponseFormat>, next: NextFunction) => {
    const userId: string = `${req.user?.id}`;
    const eventId: string = req.params?.eventId;

    const ownerEvent = await getOwnerEventService(next, userId, eventId);

    res.status(200).json({ success: true, statusCode: 200, data: ownerEvent });
  }
);

const publishedEventController = asyncHandler(
  async (req: IRequest, res: Response<ResponseFormat>, next: NextFunction) => {
    const userId: string = `${req.user?.id}`;

    const publishedEventMsg = await publishedEventService(
      next,
      req.body,
      userId
    );

    res
      .status(200)
      .json({ success: true, statusCode: 200, message: publishedEventMsg });
  }
);

const FilterVenueController = asyncHandler(
  async (req: IRequest, res: Response<ResponseFormat>, next: NextFunction) => {
    if (req.query.date === undefined) {
      throw new ErrorResponse("Date is required", 400);
    }
    const rawDate = req.query.date;
    if (typeof rawDate !== "string") {
      throw new ErrorResponse("Invalid date: must be a string", 400);
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(rawDate)) {
      throw new ErrorResponse("Invalid date format: expected yyyy-mm-dd", 400);
    }
    const { venueName, locationType, maxAttendees } = req.query;
    const filters: FilterOptions = {
      venueName: typeof venueName === "string" ? venueName : undefined,
      locationType:
        typeof locationType === "string"
          ? (locationType as "indoor" | "outdoor")
          : undefined,
      maxAttendees:
        typeof maxAttendees === "string"
          ? parseInt(maxAttendees, 10)
          : undefined,
      date: rawDate,
    };
    const venues = await filterEventService(filters, next);

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: venues,
    });
  }
);

export {
  EventController,
  publishedEventController,
  getAllPublishedEventController,
  getPublishedEventController,
  getOwnerAllEventsController,
  getOwnerEventController,
  FilterVenueController,
};
