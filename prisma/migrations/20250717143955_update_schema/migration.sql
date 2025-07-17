-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "favUsers" TEXT[];

-- CreateTable
CREATE TABLE "FavoriteEvents" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FavoriteEvents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteEvents_userId_eventId_key" ON "FavoriteEvents"("userId", "eventId");

-- AddForeignKey
ALTER TABLE "FavoriteEvents" ADD CONSTRAINT "FavoriteEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteEvents" ADD CONSTRAINT "FavoriteEvents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
