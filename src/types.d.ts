import { InstanceType, Instance, PrismaClient } from ".prisma/client";
import { Location } from "@prisma/client";

type CommonAutoFields = "id" | "dateCreated" | "dateUpdated";

type PreSaveInstanceType = Omit<InstanceType, CommonAutoFields>;

interface ExpandedInstance extends Instance {
  location: Location;
  instanceType: InstanceType;
}

type HandleRequestPassword = (
  instanceId: string
) => Promise<string | undefined>;

type CreateLocationData = Pick<
  Location,
  "name" | "region" | "vpcId" | "subnetIds"
>;
