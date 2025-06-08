import { NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import {
  AddVenueRequestBody,
  FilteredVenueResponse,
  FilterOptions,
} from "../types/Event-types/EventTypes";

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

export const filterEventService = async (
  filters: FilterOptions,
  next: NextFunction
): Promise<FilteredVenueResponse[]> => {
  try {
    const venue = await prisma.venue.findMany({
      where: {
        ...(filters.venueName && {
          venueName: { contains: filters.venueName, mode: "insensitive" },
        }),
        ...(filters.locationType && { locationType: filters.locationType }),
        ...(filters.maxAttendees && { maxAttendees: filters.maxAttendees }),
      },
      select: {
        id: true,
        venueName: true,
        locationType: true,
        maxAttendees: true,
      },
    });

    return venue;
  } catch (error: any) {
    next(error);
    throw error;
  }
};
