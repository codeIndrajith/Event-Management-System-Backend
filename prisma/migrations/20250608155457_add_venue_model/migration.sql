-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('indoor', 'outdoor');

-- CreateTable
CREATE TABLE "Venue" (
    "id" TEXT NOT NULL,
    "venueName" TEXT NOT NULL,
    "locationType" "LocationType" NOT NULL,
    "maxAttendees" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);
