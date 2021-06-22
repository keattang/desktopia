import { InstanceType, Instance, PrismaClient } from ".prisma/client";
import { Location } from "@prisma/client";

// Fixes issues in prisma.ts
declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }
  }
}

type CommonAutoFields = "id" | "dateCreated" | "dateUpdated";

type PreSaveInstanceType = Omit<InstanceType, CommonAutoFields>;

interface ExpandedInstance extends Instance {
  location: Location;
  instanceType: InstanceType;
}
