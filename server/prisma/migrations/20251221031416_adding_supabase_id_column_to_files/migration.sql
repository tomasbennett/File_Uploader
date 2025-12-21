/*
  Warnings:

  - A unique constraint covering the columns `[supabaseFileId]` on the table `Files` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `supabaseFileId` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "supabaseFileId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Files_supabaseFileId_key" ON "Files"("supabaseFileId");
