import { Request, NextFunction } from "express";
import {
  AddFavoriteEventRequestBody,
  EventRequestBody,
  EventResponse,
  PublishedEventDatesResponse,
  PublishEventRequestBody,
  UserFavouriteEventResponse,
} from "../types/Event-types/EventTypes";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { ErrorResponse } from "../utils/errorResponse";
import { sanitizeResponse } from "../utils/sanitizedResponse";

const prisma: any = new PrismaClient();

export const eventService = async (
  input: EventRequestBody,
  userId: string,
  next: NextFunction
): Promise<any> => {
  try {
    const { maxAttendees } = await prisma.venue.findUnique({
      where: {
        id: input.venuId,
      },
    });

    if (maxAttendees === 0) {
      throw new ErrorResponse("This venue not good for any events", 400);
    }

    const docId: any = uuidv4();
    const event = await prisma.event.create({
      data: {
        id: docId,
        senderId: userId,
        senderName: input.senderNamer,
        senderRole: input.senderRole,
        senderOrganization: input.senderOrganization,
        eventName: input.eventName,
        eventDate: input.eventDate,
        eventTime: input.eventTime,
        eventLocation: input.venue,
        freeSlots: maxAttendees,
        venueId: input.venuId,
        letterLink: input.letterLink,
      },
    });

    if (event) {
      await prisma.venueDates.create({
        data: {
          date: input?.eventDate,
          venuId: input?.venuId,
          eventId: event?.id,
          isSelected: true,
        },
      });

      return {
        success: true,
        eventId: event?.id,
      };
    } else {
      return {
        success: false,
      };
    }
  } catch (error: any) {
    next(error);
    throw error;
  }
};

export const getAllEventService = async (
  next: NextFunction
): Promise<EventResponse[] | []> => {
  try {
    const events: EventResponse[] = await prisma.event.findMany({
      where: {
        isPublished: true,
        isApproved: true,
      },
      select: {
        id: true,
        senderId: true,
        senderName: true,
        senderRole: true,
        senderOrganization: true,
        eventDate: true,
        eventTime: true,
        eventLocation: true,
        eventName: true,
        eventDescription: true,
        bannerImage: true,
        approvedLetterLink: true,
        reason: true,
        note: true,
        eventType: true,
        isApproved: true,
        isPublished: true,
        favUsers: true,
        joinMemberCount: true,
        freeSlots: true,
      },
    });

    return sanitizeResponse<EventResponse[]>(events);
  } catch (error: any) {
    next(error);
    throw error;
  }
};

export const getPublishedEventService = async (
  next: NextFunction,
  eventId: string
): Promise<EventResponse> => {
  try {
    const event: EventResponse | null = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        id: true,
        senderId: true,
        senderName: true,
        senderRole: true,
        senderOrganization: true,
        eventDate: true,
        eventTime: true,
        eventLocation: true,
        eventName: true,
        eventDescription: true,
        bannerImage: true,
        note: true,
        eventType: true,
        isApproved: true,
        isPublished: true,
        letterLink: true,
        approvedLetterLink: true,
        favUsers: true,
        joinMemberCount: true,
        freeSlots: true,
      },
    });

    if (!event) {
      throw new ErrorResponse("Event not found", 404);
    }

    if (event.isPublished === false) {
      throw new ErrorResponse("Event not published", 403);
    }

    return sanitizeResponse<EventResponse>(event);
  } catch (error: any) {
    next(error);
    throw error;
  }
};

export const getPublishedEventDatesService = async (
  next: NextFunction
): Promise<PublishedEventDatesResponse[]> => {
  try {
    const eventDates = await prisma.event.findMany({
      where: {
        isPublished: true,
        isApproved: true,
      },
      select: {
        id: true,
        eventName: true,
        eventDate: true,
      },
    });

    if (eventDates.length === 0) {
      throw new ErrorResponse("Published Events not found", 404);
    }

    return eventDates;
  } catch (error: any) {
    next(error);
    throw error;
  }
};

export const getOwnerAllEventService = async (
  next: NextFunction,
  userId: string
): Promise<EventResponse[] | []> => {
  try {
    const rawEvents: EventResponse[] = await prisma.event.findMany({
      where: {
        senderId: userId,
      },
      select: {
        id: true,
        senderId: true,
        senderName: true,
        senderRole: true,
        senderOrganization: true,
        eventName: true,
        eventDate: true,
        eventTime: true,
        reason: true,
        eventLocation: true,
        isApproved: true,
        isPublished: true,
        letterLink: true,
        approvedLetterLink: true,
        favUsers: true,
        joinMemberCount: true,
        freeSlots: true,
      },
    });

    return sanitizeResponse<EventResponse[]>(rawEvents);
  } catch (error: any) {
    next(error);
    throw error;
  }
};

export const getOwnerEventService = async (
  next: NextFunction,
  userId: string,
  eventId: string
): Promise<EventResponse[] | []> => {
  try {
    const event = await prisma.event.findFirst({
      where: {
        senderId: userId,
        id: eventId,
      },
      select: {
        id: true,
        senderId: true,
        senderName: true,
        senderRole: true,
        senderOrganization: true,
        eventName: true,
        eventDate: true,
        eventTime: true,
        eventLocation: true,
        reason: true,
        isApproved: true,
        isPublished: true,
        letterLink: true,
        approvedLetterLink: true,
        favUsers: true,
        joinMemberCount: true,
        freeSlots: true,
      },
    });

    if (!event) {
      throw new ErrorResponse("Event Not Found", 404);
    }

    if (event && event.approvedLetterLink === null) {
      delete event.approvedLetterLink;
    }

    return sanitizeResponse(event);
  } catch (error: any) {
    next(error);
    throw error;
  }
};

export const publishedEventService = async (
  next: NextFunction,
  data: PublishEventRequestBody,
  userId: string
): Promise<string> => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: data?.eventId },
      select: { isApproved: true },
    });
    if (!event.isApproved) {
      throw new ErrorResponse("Event is not approved yet", 400);
    }
    const publishEvent = await prisma.event.update({
      where: {
        id: data?.eventId,
      },
      data: {
        // eventName: data?.eventName,
        eventDescription: data?.eventDescription,
        bannerImage: data?.bannerImage,
        note: data?.note,
        eventType: data?.eventType,
        isPublished: true,
      },
    });

    if (publishEvent) {
      return "Event Publish Complete";
    } else {
      return "Event Publish Failed";
    }
  } catch (error: any) {
    next(error);
    throw error;
  }
};

export const addFavoriteEventService = async (
  next: NextFunction,
  data: AddFavoriteEventRequestBody,
  userId: string
): Promise<string> => {
  try {
    const isPublished = await prisma.event.findFirst({
      where: {
        isApproved: true,
        isPublished: true,
      },
    });
    if (!isPublished) {
      throw new ErrorResponse("Event is not published", 400);
    }
    const existingFavourites = await prisma.favoriteEvents.findFirst({
      where: {
        eventId: data.eventId,
        userId: userId,
      },
    });
    if (existingFavourites) {
      throw new ErrorResponse("Event is already in favorites", 400);
    }
    const eventAddFavorite = await prisma.favoriteEvents.create({
      data: {
        eventId: data.eventId,
        userId: userId,
      },
    });

    await prisma.event.update({
      where: {
        id: data.eventId,
      },
      data: {
        favUsers: { push: userId },
      },
    });
    if (eventAddFavorite) {
      return "Event Add To Favourite";
    } else {
      throw new ErrorResponse("Failed to add event to favorites", 400);
    }
  } catch (error: any) {
    next(error);
    throw error;
  }
};

export const removeAddedFavoriteEventService = async (
  next: NextFunction,
  userId: string,
  eventId: string
): Promise<string> => {
  try {
    const existingFavorite = await prisma.favoriteEvents.findFirst({
      where: {
        eventId: eventId,
        userId: userId,
      },
    });

    if (!existingFavorite) {
      throw new ErrorResponse("Favorite event not found", 404);
    }
    const removeFavourite = await prisma.favoriteEvents.delete({
      where: {
        id: existingFavorite?.id,
      },
    });

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    const updatedFavUsers = event?.favUsers.filter(
      (id: string) => id !== userId
    );

    await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        favUsers: updatedFavUsers,
      },
    });
    if (removeFavourite) {
      return "Event removed from Favourite";
    } else {
      throw new ErrorResponse("Failed to remove event from favorites", 400);
    }
  } catch (error: any) {
    next(error);
    throw error;
  }
};

export const getUserddedFavoriteEventService = async (
  next: NextFunction,
  userId: string
): Promise<UserFavouriteEventResponse[]> => {
  try {
    const events = await prisma.favoriteEvents.findMany({
      where: {
        userId: userId,
      },
      include: {
        event: true,
      },
    });

    const cleanedEvents = events.map((fav: any) => ({
      ...fav,
      event: fav.event
        ? Object.fromEntries(
            Object.entries(fav.event).filter(([_, value]) => value !== null)
          )
        : null,
    }));

    return sanitizeResponse(cleanedEvents);
  } catch (error: any) {
    next(error);
    throw error;
  }
};
