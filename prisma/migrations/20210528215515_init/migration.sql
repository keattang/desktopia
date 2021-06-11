-- CreateTable
CREATE TABLE "InstanceType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "vCpus" INTEGER NOT NULL,
    "cores" INTEGER NOT NULL,
    "memory" INTEGER NOT NULL,
    "networkPerformance" TEXT NOT NULL,
    "pricePerHour" DOUBLE PRECISION NOT NULL,
    "region" TEXT NOT NULL,
    "operatingSystem" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstanceType.name_unique" ON "InstanceType"("name");
