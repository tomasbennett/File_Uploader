-- DropIndex
DROP INDEX "Files_filename_key";

-- AlterTable
ALTER TABLE "Folder" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Shared" (
    "id" UUID NOT NULL,
    "sharedFolderId" UUID NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shared_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedNode" (
    "id" UUID NOT NULL,
    "sharedRelationshipId" UUID NOT NULL,
    "folderId" UUID,
    "fileId" UUID,
    "parentNodeId" UUID,

    CONSTRAINT "SharedNode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shared_sharedFolderId_key" ON "Shared"("sharedFolderId");

-- AddForeignKey
ALTER TABLE "Shared" ADD CONSTRAINT "Shared_sharedFolderId_fkey" FOREIGN KEY ("sharedFolderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedNode" ADD CONSTRAINT "SharedNode_sharedRelationshipId_fkey" FOREIGN KEY ("sharedRelationshipId") REFERENCES "Shared"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedNode" ADD CONSTRAINT "SharedNode_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedNode" ADD CONSTRAINT "SharedNode_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedNode" ADD CONSTRAINT "SharedNode_parentNodeId_fkey" FOREIGN KEY ("parentNodeId") REFERENCES "SharedNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
