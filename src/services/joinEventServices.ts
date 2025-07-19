import { NextFunction } from "express";
import { JoinEventRequestBody } from "../types/Event-types/EventJoinTypes";
import { PrismaClient } from "@prisma/client";
import { ErrorResponse } from "../utils/errorResponse";

const prisma: any = new PrismaClient();

export const eventJoinService = async (
  next: NextFunction,
  data: JoinEventRequestBody,
  user: any
): Promise<string> => {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: data.eventId,
      },
    });

    if (!event) {
      throw new ErrorResponse("Event not found", 404);
    }

    if (event?.joinMemberCount === event?.freeSlots) {
      throw new ErrorResponse(
        "This event is fully booked. You cannot join at the moment",
        404
      );
    }

    if (event?.isPublished === false || event?.isApproved === false) {
      throw new ErrorResponse("Event not Approved or Published", 400);
    }

    const [joinedMember] = await prisma.$transaction([
      prisma.joinMembers.create({
        data: {
          eventId: data.eventId,
          participantId: user.id,
          participantName: user.name,
          participantEmail: user.email,
          contactNumber: data.contactNumber,
        },
      }),
      prisma.event.update({
        where: { id: data.eventId },
        data: {
          joinMemberCount: { increment: 1 },
        },
      }),
    ]);

    if (joinedMember) {
      return "Event Joined Complete";
    } else {
      return "Event Joined Failed";
    }
  } catch (error: any) {
    next(error);
    throw error;
  }
};
