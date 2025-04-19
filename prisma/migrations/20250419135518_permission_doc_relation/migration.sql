-- CreateTable
CREATE TABLE "PermissionDoc" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "senderRole" TEXT NOT NULL,
    "senderOrganization" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "eventTime" TIMESTAMP(3) NOT NULL,
    "eventLocation" TEXT NOT NULL,
    "letterLink" TEXT NOT NULL,

    CONSTRAINT "PermissionDoc_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PermissionDoc" ADD CONSTRAINT "PermissionDoc_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
