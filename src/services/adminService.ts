import { NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import {
  AddVenueRequestBody,
  AdminDashboardDataServiceResponse,
  ApproveEventRequestBody,
  EventResponse,
  FilteredVenueResponse,
  FilterOptions,
  VenueResponse,
} from "../types/Event-types/EventTypes";
import { ErrorResponse } from "../utils/errorResponse";

const prisma: any = new PrismaClient();

export const addVenuService = async (
  input: AddVenueRequestBody,
  userId: string,
  next: NextFunction
): Promise<boolean> => {
  try {
    const docId: any = uuidv4();
    const venue = await prisma.venue.create({
      data: {
        id: docId,
        adminId: userId,
        venueName: input.venueName,
        locationType: input.locationType,
        maxAttendees: input.maxAttendees,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    if (venue) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    next(error);
    throw error;
  }
};

export const getAllVenuService = async (
  pageNumber: number,
  pageSize: number,
  next: NextFunction,
  venueId?: string
): Promise<VenueResponse[]> => {
  try {
    const skip = (pageNumber - 1) * pageSize;
    const getAllEvent = await prisma.venue.findMany({
      skip,
      take: pageSize,
      where: venueId
        ? {
            id: venueId,
          }
        : undefined,
      select: {
        id: true,
        venueName: true,
        locationType: true,
        maxAttendees: true,
      },
    });

    return getAllEvent;
  } catch (error: any) {
    next(error);
    throw error;
  }
};

export const updateVenuService = async (
  data: AddVenueRequestBody,
  venueId: string,
  next: NextFunction
): Promise<string> => {
  try {
    const updateEvent = await prisma.venue.update({
      where: {
        id: venueId,
      },
      data: {
        venueName: data?.venueName,
        locationType: data?.locationType,
        maxAttendees: data?.maxAttendees,
      },
    });

    if (updateEvent) {
      return "Event update complete";
    } else {
      return "Event update failed";
    }
  } catch (error: any) {
    next(error);
    throw error;
  }
};

export const approveEventService = async (
  next: NextFunction,
  data: ApproveEventRequestBody
): Promise<string> => {
  try {
    const eventApproved = await prisma.event.update({
      where: {
        id: data?.eventId,
      },
      data: {
        approvedLetterLink: data?.isApproved ? data?.approvedLetterLink : null,
        approverName: data?.approverName,
        approverRole: data?.approverRole,
        isApproved: data?.isApproved,
        reason: data?.isApproved === false ? data?.reason : null,
      },
    });

    if (data?.isApproved === false) {
      await prisma.venueDates.updateMany({
        where: {
          eventId: data?.eventId,
        },
        data: {
          isSelected: false,
        },
      });
    }

    if (eventApproved) {
      return "Event Active Change Complete";
    } else {
      return "Event Approve Failed";
    }
  } catch (error: any) {
    next(error);
    throw error;
  }
};

export const pendingApproveEventService = async (
  next: NextFunction,
  limit?: number
): Promise<EventResponse[]> => {
  try {
    const pendingApproveEvents = await prisma.event.findMany({
      where: {
        isPublished: false,
      },
      orderBy: {
        eventDate: "asc",
      },
      take: limit,
      select: {
        id: true,
        eventDate: true,
        eventTime: true,
        eventLocation: true,
        eventName: true,
        senderName: true,
        senderRole: true,
        senderOrganization: true,
        letterLink: true,
        isApproved: true,
      },
    });

    return pendingApproveEvents;
  } catch (error: any) {
    next(error);
    throw error;
  }
};

export const filterEventService = async (
  filters: FilterOptions,
  next: NextFunction
): Promise<FilteredVenueResponse[]> => {
  try {
    const venues = await prisma.venue.findMany({
      where: {
        ...(filters.venueName && {
          venueName: { contains: filters.venueName, mode: "insensitive" },
        }),
        ...(filters.locationType && { locationType: filters.locationType }),
        ...(filters.maxAttendees && { maxAttendees: filters.maxAttendees }),

        // Check venu is available or not
        venueDates: {
          none: {
            date: filters.date,
            isSelected: true,
          },
        },
      },
      select: {
        id: true,
        venueName: true,
        locationType: true,
        maxAttendees: true,
      },
    });

    if (venues.length === 0) {
      throw new ErrorResponse("No venues available on this date", 400);
    }

    return venues;
  } catch (error: any) {
    next(error);
    throw error;
  }
};

export const adminDashboardDataService = async (
  next: NextFunction
): Promise<AdminDashboardDataServiceResponse> => {
  try {
    const [totalEvent, activeVenues, pendingEvents] = await Promise.all([
      prisma.event.count(),
      prisma.venue.count(),
      prisma.event.count({ where: { isApproved: false } }),
    ]);

    return {
      totalEvent,
      activeVenues,
      pendingEvents,
    };
  } catch (error: any) {
    next(error);
    throw error;
  }
};
