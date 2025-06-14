import { NextFunction } from "express";
import { JoinEventRequestBody } from "../types/Event-types/EventJoinTypes";
import { PrismaClient } from "@prisma/client";

const prisma: any = new PrismaClient();

export const eventJoinService = async (
  next: NextFunction,
  data: JoinEventRequestBody,
  user: any
): Promise<string> => {
  try {
    const joinMemberMsg = await prisma.joinMembers.create({
      data: {
        eventId: data?.eventId,
        participantId: user?.id,
        participantName: user?.name,
        participantEmail: user?.email,
        contactNumber: data?.contactNumber,
      },
    });

    if (joinMemberMsg) {
      return "Event Joined Complete";
    } else {
      return "Event Joined Failed";
    }
  } catch (error: any) {
    next(error);
    throw error;
  }
};
