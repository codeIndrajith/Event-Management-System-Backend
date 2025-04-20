import { NextFunction } from "express";
import { PermissionLetterRequestBody } from "../types/Event-types/EventTypes";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma: any = new PrismaClient();

export const eventService = async (
  input: PermissionLetterRequestBody,
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
