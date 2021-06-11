-- CreateTable
CREATE TABLE "Instance" (
    "id" TEXT NOT NULL,
    "instanceId" TEXT NOT NULL,
    "instanceTypeId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Instance" ADD FOREIGN KEY ("instanceTypeId") REFERENCES "InstanceType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instance" ADD FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
