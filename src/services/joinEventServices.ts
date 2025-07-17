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

    const venue = await prisma.venue.findUnique({
      where: {
        id: event.venueId,
      },
    });

    if (venue?.freeSlots === 0) {
      throw new ErrorResponse(
        "This event is fully booked. You cannot join at the moment",
        404
      );
    }

    const joinMemberMsg = await prisma.joinMembers.create({
      data: {
        eventId: data?.eventId,
        participantId: user?.id,
        participantName: user?.name,
        participantEmail: user?.email,
        contactNumber: data?.contactNumber,
      },
    });

    console.log(data.eventId);

    await prisma.event.update({
      where: {
        id: data?.eventId,
      },
      data: {
        joinCount: {
          increment: 1,
        },
      },
    });

    await prisma.venue.update({
      where: {
        id: event.venueId,
      },
      data: {
        freeSlots: {
          decrement: 1,
        },
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
