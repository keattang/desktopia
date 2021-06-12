import { InstanceType, PrismaClient } from ".prisma/client";

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
