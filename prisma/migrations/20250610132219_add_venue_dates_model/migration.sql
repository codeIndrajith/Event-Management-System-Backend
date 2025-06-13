-- CreateTable
CREATE TABLE "VenueDates" (
    "id" TEXT NOT NULL,
    "venuId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueDates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VenueDates" ADD CONSTRAINT "VenueDates_venuId_fkey" FOREIGN KEY ("venuId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
