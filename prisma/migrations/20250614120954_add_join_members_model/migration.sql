-- CreateTable
CREATE TABLE "JoinMembers" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "participantName" TEXT NOT NULL,
    "participantEmail" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,

    CONSTRAINT "JoinMembers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JoinMembers" ADD CONSTRAINT "JoinMembers_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinMembers" ADD CONSTRAINT "JoinMembers_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
