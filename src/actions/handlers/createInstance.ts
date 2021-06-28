import { RunInstancesCommandInput } from "@aws-sdk/client-ec2";
import { InstanceType, Location } from "@prisma/client";
import runInstance from "../../aws/runInstance";
import { KEY_PAIR_NAME } from "../../config";
import { MANAGED_TAG_KEY } from "../../constants";
import prisma from "../../prisma";

interface ICreateInstanceHandler {
  location: Location;
  instanceType: InstanceType;
}

export const CREATE_INSTANCE = "CREATE_INSTANCE";

export const createInstance = async ({
  location,
  instanceType,
}: ICreateInstanceHandler) => {
  const subnetId =
    location.subnetIds[Math.floor(Math.random() * location.subnetIds.length)];

  const params: RunInstancesCommandInput = {
    ImageId: "ami-077f1edd46ddb3129", // Windows Server 2019
    InstanceType: instanceType.name,
    SubnetId: subnetId,
    //   SecurityGroups: [],
    InstanceInitiatedShutdownBehavior: "stop",
    // IamInstanceProfile: {}
    KeyName: KEY_PAIR_NAME,
    UserData: "",
    MinCount: 1,
    MaxCount: 1,
    TagSpecifications: [
      {
        ResourceType: "instance",
        Tags: [{ Key: MANAGED_TAG_KEY, Value: "true" }],
      },
    ],
  };

  const resp = await runInstance(location.region, params);
  const awsInstance = resp.Instances?.[0];

  if (!awsInstance || !awsInstance.InstanceId) {
    throw Error("Unable to launch instance.");
  }

  const dbInstance = await prisma.instance.create({
    data: {
      instanceId: awsInstance.InstanceId!,
      instanceTypeId: instanceType.id,
      locationId: location.id,
      state: awsInstance.State?.Name,
      publicDnsName: awsInstance.PublicDnsName,
    },
  });

  return {
    awsInstance,
    dbInstance,
  };
};
