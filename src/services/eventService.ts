import { Request, NextFunction } from "express";
import {
  EventRequestBody,
  EventResponse,
  PublishEventRequestBody,
} from "../types/Event-types/EventTypes";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { ErrorResponse } from "../utils/errorResponse";

const prisma: any = new PrismaClient();

export const eventService = async (
  input: EventRequestBody,
  userId: string,
  next: NextFunction
): Promise<any> => {
  try {
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
        reason: true,
        note: true,
        eventType: true,
        isApproved: true,
        isPublished: true,
      },
    });

    return events;
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
      },
    });

    if (!event) {
      throw new ErrorResponse("Event not found", 404);
    }

    if (event.isPublished === false) {
      throw new ErrorResponse("Event not published", 403);
    }

    return event;
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
      },
    });

    const events = rawEvents.map(({ approvedLetterLink, ...rest }) =>
      approvedLetterLink == null ? rest : { ...rest, approvedLetterLink }
    );

    return events;
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
      },
    });

    if (!event) {
      throw new ErrorResponse("Event Not Found", 404);
    }

    if (event && event.approvedLetterLink === null) {
      delete event.approvedLetterLink;
    }

    return event;
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
