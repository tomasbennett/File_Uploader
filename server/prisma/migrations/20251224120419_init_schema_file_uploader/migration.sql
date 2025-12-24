-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "file_uploader";

-- CreateTable
CREATE TABLE "file_uploader"."User" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rootFolderId" UUID NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_uploader"."Folder" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "parentFolderId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_uploader"."Files" (
    "id" UUID NOT NULL,
    "filename" TEXT NOT NULL,
    "filesize" INTEGER NOT NULL,
    "filetype" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parentFolderId" UUID NOT NULL,
    "supabaseFileId" TEXT NOT NULL,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_uploader"."Shared" (
    "id" UUID NOT NULL,
    "sharedFolderId" UUID NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shared_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_uploader"."SharedNode" (
    "id" UUID NOT NULL,
    "sharedRelationshipId" UUID NOT NULL,
    "folderId" UUID,
    "fileId" UUID,
    "parentNodeId" UUID,

    CONSTRAINT "SharedNode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "file_uploader"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_rootFolderId_key" ON "file_uploader"."User"("rootFolderId");

-- CreateIndex
CREATE UNIQUE INDEX "Files_supabaseFileId_key" ON "file_uploader"."Files"("supabaseFileId");

-- CreateIndex
CREATE UNIQUE INDEX "Shared_sharedFolderId_key" ON "file_uploader"."Shared"("sharedFolderId");

-- CreateIndex
CREATE UNIQUE INDEX "SharedNode_sharedRelationshipId_folderId_key" ON "file_uploader"."SharedNode"("sharedRelationshipId", "folderId");

-- CreateIndex
CREATE UNIQUE INDEX "SharedNode_sharedRelationshipId_fileId_key" ON "file_uploader"."SharedNode"("sharedRelationshipId", "fileId");

-- AddForeignKey
ALTER TABLE "file_uploader"."User" ADD CONSTRAINT "User_rootFolderId_fkey" FOREIGN KEY ("rootFolderId") REFERENCES "file_uploader"."Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_uploader"."Folder" ADD CONSTRAINT "Folder_parentFolderId_fkey" FOREIGN KEY ("parentFolderId") REFERENCES "file_uploader"."Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_uploader"."Files" ADD CONSTRAINT "Files_parentFolderId_fkey" FOREIGN KEY ("parentFolderId") REFERENCES "file_uploader"."Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_uploader"."Shared" ADD CONSTRAINT "Shared_sharedFolderId_fkey" FOREIGN KEY ("sharedFolderId") REFERENCES "file_uploader"."Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_uploader"."SharedNode" ADD CONSTRAINT "SharedNode_sharedRelationshipId_fkey" FOREIGN KEY ("sharedRelationshipId") REFERENCES "file_uploader"."Shared"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_uploader"."SharedNode" ADD CONSTRAINT "SharedNode_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "file_uploader"."Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_uploader"."SharedNode" ADD CONSTRAINT "SharedNode_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "file_uploader"."Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_uploader"."SharedNode" ADD CONSTRAINT "SharedNode_parentNodeId_fkey" FOREIGN KEY ("parentNodeId") REFERENCES "file_uploader"."SharedNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
