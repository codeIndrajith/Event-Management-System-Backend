import { NextFunction } from "express";
import { PermissionLetterRequestBody } from "../types/Event-types/EventTypes";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export const permissionLetterService = async (
  input: PermissionLetterRequestBody,
  userId: string,
  next: NextFunction
): Promise<void> => {
  try {
    const docId: any = uuidv4();
    const permissionDoc = await prisma.permissionDoc.create({
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

    console.log(permissionDoc);
  } catch (error: any) {
    next(error);
    throw error;
  }
};
