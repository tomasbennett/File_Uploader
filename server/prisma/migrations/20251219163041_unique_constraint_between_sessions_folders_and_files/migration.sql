/*
  Warnings:

  - A unique constraint covering the columns `[sharedRelationshipId,folderId]` on the table `SharedNode` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sharedRelationshipId,fileId]` on the table `SharedNode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SharedNode_sharedRelationshipId_folderId_key" ON "SharedNode"("sharedRelationshipId", "folderId");

-- CreateIndex
CREATE UNIQUE INDEX "SharedNode_sharedRelationshipId_fileId_key" ON "SharedNode"("sharedRelationshipId", "fileId");
