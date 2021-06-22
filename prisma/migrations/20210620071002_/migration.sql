/*
  Warnings:

  - A unique constraint covering the columns `[instanceId]` on the table `Instance` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Instance" ADD COLUMN     "state" TEXT,
ADD COLUMN     "password" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Instance.instanceId_unique" ON "Instance"("instanceId");
