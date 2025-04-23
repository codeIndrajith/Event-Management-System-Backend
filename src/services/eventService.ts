import { Request, NextFunction } from "express";
import {
  EventRequestBody,
  EventResponse,
} from "../types/Event-types/EventTypes";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { ErrorResponse } from "../utils/errorResponse";

const prisma: any = new PrismaClient();

export const eventService = async (
  input: EventRequestBody,
  userId: string,
  next: NextFunction
): Promise<boolean> => {
  try {
    const docId: any = uuidv4();
    const event = await prisma.event.create({
      data: {
        id: docId,
        senderId: userId,
        senderName: input.senderNamer,
        senderRole: input.senderRole,
        senderOrganization: input.senderOrganization,
        eventDate: new Date(input.eventDate),
        eventTime: new Date(input.eventTime),
        eventLocation: input.eventLocation,
        letterLink: input.letterLink,
      },
    });

    if (event) {
      return true;
    } else {
      return false;
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
      },
    });

    return events;
  } catch (error: any) {
    next(error);
    throw error;
  }
};

export const getEventService = async (
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

export const getOwnerEventService = async (
  next: NextFunction,
  userId: string
): Promise<EventResponse[] | []> => {
  try {
    const events: EventResponse[] = await prisma.event.findMany({
      where: {
        senderId: userId,
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
        isApproved: true,
      },
    });

    return events;
  } catch (error: any) {
    next(error);
    throw error;
  }
};
