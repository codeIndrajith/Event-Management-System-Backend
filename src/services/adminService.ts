import { NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import {
  AddVenueRequestBody,
  ApproveEventRequestBody,
  FilteredVenueResponse,
  FilterOptions,
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

export const approveEventService = async (
  next: NextFunction,
  data: ApproveEventRequestBody
): Promise<string> => {
  try {
    const isApproved = await prisma.event.update({
      where: {
        id: data?.eventId,
        isApproved: true,
      },
      data: {
        approvedLetterLink: data?.approvedLetterLink,
        approverName: data?.approverName,
        approverRole: data?.approverRole,
        isApproved: true,
      },
    });

    if (isApproved) {
      return "Event Approve Complete";
    } else {
      return "Event Approve Failed";
    }
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
