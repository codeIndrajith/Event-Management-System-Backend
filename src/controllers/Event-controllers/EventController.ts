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
  getPublishedEventDatesService,
  addFavoriteEventService,
  removeAddedFavoriteEventService,
  getUserddedFavoriteEventService,
  getEventHistoryService,
} from "../../services/eventService";
import { filterEventService } from "../../services/adminService";
import { ErrorResponse } from "../../utils/errorResponse";
import {
  EventHistoryFilters,
  FilterOptions,
} from "../../types/Event-types/EventTypes";

const EventController = asyncHandler(
  async (req: IRequest, res: Response<ResponseFormat>, next: NextFunction) => {
    const userId: string = `${req.user?.id}`;

    const response = await eventService(req.body, userId, next);

    if (response?.success) {
      res.status(201).json({
        success: response?.success,
        statusCode: 201,
        message: "Event created",
        data: {
          eventId: response?.eventId,
        },
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

const getAllPublishedEventDatesController = asyncHandler(
  async (req: Request, res: Response<ResponseFormat>, next: NextFunction) => {
    const allEventDates = await getPublishedEventDatesService(next);

    res
      .status(200)
      .json({ success: true, statusCode: 200, data: allEventDates });
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

// Favorites events controllers
const addFavoriteEventController = asyncHandler(
  async (req: IRequest, res: Response<ResponseFormat>, next: NextFunction) => {
    const userId: string = req.user?.id as string;

    const eventAddToFavoriteMsg = await addFavoriteEventService(
      next,
      req.body,
      userId
    );

    res
      .status(201)
      .json({ success: true, statusCode: 201, message: eventAddToFavoriteMsg });
  }
);

const removeAddedFavoriteEventController = asyncHandler(
  async (req: IRequest, res: Response<ResponseFormat>, next: NextFunction) => {
    const userId: string = req.user?.id as string;
    const eventId: string = req.params?.eventId;

    const eventAddToFavoriteMsg = await removeAddedFavoriteEventService(
      next,
      userId,
      eventId
    );

    res
      .status(200)
      .json({ success: true, statusCode: 200, message: eventAddToFavoriteMsg });
  }
);

const getuserAddedFavoriteEventController = asyncHandler(
  async (req: IRequest, res: Response<ResponseFormat>, next: NextFunction) => {
    const userId: string = req.user?.id as string;

    const userEvent = await getUserddedFavoriteEventService(next, userId);

    res.status(200).json({ success: true, statusCode: 200, data: userEvent });
  }
);

// controller
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

    const { venueName, locationType, maxAttendees, startTime, endTime } =
      req.query;

    // Validate time formats if provided
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;

    if (
      startTime &&
      typeof startTime === "string" &&
      !timeRegex.test(startTime)
    ) {
      throw new ErrorResponse(
        "Invalid startTime format: expected HH:MM or HH:MM:SS",
        400
      );
    }

    if (endTime && typeof endTime === "string" && !timeRegex.test(endTime)) {
      throw new ErrorResponse(
        "Invalid endTime format: expected HH:MM or HH:MM:SS",
        400
      );
    }

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
      startTime: typeof startTime === "string" ? startTime : undefined,
      endTime: typeof endTime === "string" ? endTime : undefined,
    };

    const venues = await filterEventService(filters, next);

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: venues,
    });
  }
);

export const getEventHistoryController = asyncHandler(
  async (req: IRequest, res: Response<ResponseFormat>, next: NextFunction) => {
    try {
      const { month, year, venueId, eventType } = req.query;

      // Parse and validate filters
      const filters: EventHistoryFilters = {
        month: month ? parseInt(month as string) : undefined,
        year: year ? parseInt(year as string) : undefined,
        venueId: typeof venueId === "string" ? venueId : undefined,
        eventType: typeof eventType === "string" ? eventType : undefined,
      };

      // Validate month range if provided
      if (filters.month && (filters.month < 1 || filters.month > 12)) {
        throw new ErrorResponse("Month must be between 1 and 12", 400);
      }

      // Validate year if provided
      if (filters.year && filters.year < 2000) {
        throw new ErrorResponse("Year must be 2000 or later", 400);
      }

      const events = await getEventHistoryService(filters);

      res.status(200).json({
        success: true,
        statusCode: 200,
        data: events,
        message: `Found ${events.length} events`,
      });
    } catch (error: any) {
      next(error);
    }
  }
);

export {
  EventController,
  publishedEventController,
  getAllPublishedEventController,
  getAllPublishedEventDatesController,
  getPublishedEventController,
  getOwnerAllEventsController,
  getOwnerEventController,
  addFavoriteEventController,
  removeAddedFavoriteEventController,
  getuserAddedFavoriteEventController,
  FilterVenueController,
};
