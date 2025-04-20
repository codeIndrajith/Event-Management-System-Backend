/*
  Warnings:

  - You are about to drop the `PermissionDoc` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PermissionDoc" DROP CONSTRAINT "PermissionDoc_senderId_fkey";

-- DropTable
DROP TABLE "PermissionDoc";

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "senderRole" TEXT NOT NULL,
    "senderOrganization" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "eventTime" TIMESTAMP(3) NOT NULL,
    "eventLocation" TEXT NOT NULL,
    "letterLink" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "eventName" TEXT,
    "eventDescription" TEXT,
    "bannerImage" TEXT,
    "note" TEXT,
    "eventType" TEXT,
    "approvedLetterLink" TEXT,
    "approverName" TEXT,
    "approverRole" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
