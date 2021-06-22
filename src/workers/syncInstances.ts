import { Instance } from "@aws-sdk/client-ec2";
import getInstancePassword from "../aws/getInstancePassword";
import getInstances from "../aws/getInstances";
import { MANAGED_TAG_KEY, SUPPORTED_REGIONS } from "../constants";
import prisma from "../prisma";

interface IUpdateData {
  state?: string;
  password?: string;
}

const syncInstance = async (region: string, instance: Instance) => {
  const instanceId = instance.InstanceId!;
  console.log("Syncing instance", instanceId);

  const dbInstance = await prisma.instance.findUnique({
    where: { instanceId },
  });

  if (!dbInstance) {
    // TODO figure out what to do with instances that don't exist in the DB.
    return;
  }

  const updateData: IUpdateData = {
    state: instance.State?.Name,
    password: undefined,
  };

  if (!dbInstance.password || dbInstance.password === "") {
    const password = await getInstancePassword(region, instance.InstanceId!);
    updateData.password = password;
  }

  return prisma.instance.update({
    where: {
      instanceId,
    },
    data: updateData,
  });
};

const syncInstancesInRegion = async (region: string) => {
  const instances = await getInstances(region, {
    Filters: [{ Name: "tag-key", Values: [MANAGED_TAG_KEY] }],
  });

  return Promise.all(
    instances.map((instance) => syncInstance(region, instance))
  );
};

const syncInstances = () => {
  return Promise.all(SUPPORTED_REGIONS.map(syncInstancesInRegion));
};

const run = async () => {
  while (true) {
    await new Promise((resolve) =>
      setTimeout(() => resolve(syncInstances()), 30_000)
    );
  }
};

run();
