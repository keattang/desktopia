import { InstanceType, Instance, PrismaClient } from ".prisma/client";
import { TerminateInstancesCommandOutput } from "@aws-sdk/client-ec2";
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

type HandleTerminateInstance = (
  instanceId: string
) => Promise<TerminateInstancesCommandOutput["TerminatingInstances"][0]>;

type CreateLocationData = Pick<
  Location,
  "name" | "region" | "vpcId" | "subnetIds"
>;
