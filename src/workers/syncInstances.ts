import { Instance } from "@aws-sdk/client-ec2";
import { Instance as DBInstance, Prisma } from "@prisma/client";
import getInstancePassword from "../aws/getInstancePassword";
import getInstances from "../aws/getInstances";
import {
  INSTANCE_STATES,
  MANAGED_TAG_KEY,
  SUPPORTED_REGIONS,
} from "../constants";
import prisma from "../prisma";
import difference from "../utilities/intersection";

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

  const updateData: Partial<DBInstance> = {
    state: instance.State?.Name,
    publicDnsName: instance.PublicDnsName,
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

// Finds the instances that are in our database but not in AWS and sets their state to terminated.
// If they don't appear in AWS we assume that they used to exist and have since been terminated
const syncTerminatedInstances = async (
  region: string,
  instances: Instance[]
) => {
  const dbInstanceIds = (
    await prisma.instance.findMany({
      where: {
        location: {
          is: { region },
        },
        state: { not: INSTANCE_STATES.TERMINATED },
      },
      select: { instanceId: true },
    })
  ).map((instance) => instance.instanceId);

  const instanceIds = instances.map((instance) => instance.InstanceId!);

  const instancesNotInAWS = difference(
    new Set(dbInstanceIds),
    new Set(instanceIds)
  );

  if (instancesNotInAWS.size) {
    console.log(
      `Found ${instancesNotInAWS.size} active instances in our database but not AWS (${region}). ` +
        `Setting them to terminated.`
    );
    await prisma.instance.updateMany({
      where: {
        instanceId: {
          in: Array.from(instancesNotInAWS),
        },
      },
      data: {
        state: INSTANCE_STATES.TERMINATED,
      },
    });
  }
};

const syncInstancesInRegion = async (region: string) => {
  const instances = await getInstances(region, {
    Filters: [{ Name: "tag-key", Values: [MANAGED_TAG_KEY] }],
  });

  await Promise.all([
    ...instances.map((instance) => syncInstance(region, instance)),
  ]);

  await syncTerminatedInstances(region, instances);
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
