-- DropForeignKey
ALTER TABLE "Files" DROP CONSTRAINT "Files_parentFolderId_fkey";

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_parentFolderId_fkey" FOREIGN KEY ("parentFolderId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
