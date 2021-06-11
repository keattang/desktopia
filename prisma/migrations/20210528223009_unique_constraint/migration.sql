/*
  Warnings:

  - A unique constraint covering the columns `[name,pricePerHour,region,operatingSystem]` on the table `InstanceType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "InstanceType.name_pricePerHour_region_operatingSystem_unique" ON "InstanceType"("name", "pricePerHour", "region", "operatingSystem");
