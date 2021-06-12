import { InstanceType, Location, PrismaClient } from ".prisma/client";
import { MappedDateToIso } from "./utilities/serialiseDates";

// Fixes issues in prisma.ts
declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }
  }
}

type AutoDateFields = "dateCreated" | "dateUpdated";

type PreSaveInstanceType = Omit<InstanceType, "id" | AutoDateFields>;

type SerialisedInstanceType = MappedDateToIso<InstanceType, AutoDateFields>;

type SerialisedLocation = MappedDateToIso<Location, AutoDateFields>;
