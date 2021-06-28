import { Instance, Location } from "@prisma/client";
import terminateInstances from "../../aws/terminateInstances";

export const TERMINATE_INSTANCE = "TERMINATE_INSTANCE";

export const terminateInstance = async (
  instance: Instance & { location: Location }
) => {
  return terminateInstances(instance.location.region, {
    InstanceIds: [instance.instanceId],
  });
};
