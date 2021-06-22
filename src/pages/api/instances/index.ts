import prisma from "../../../prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { RunInstancesCommandInput, Subnet } from "@aws-sdk/client-ec2";
import { Location } from ".prisma/client";
import getSubnets from "../../../aws/getSubnets";
import runInstance from "../../../aws/runInstance";
import { MANAGED_TAG_KEY } from "../../../constants";
import { KEY_PAIR_NAME } from "../../../config";

const getVpcSubnets = (location: Location): Promise<Subnet[]> =>
  getSubnets(location.region, {
    Filters: [{ Name: "vpc-id", Values: [location.vpcId] }],
  });

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;
  if (req.method === "POST") {
    const instanceType = await prisma.instanceType.findUnique({
      where: { id: body.instanceTypeId },
    });
    const location = await prisma.location.findUnique({
      where: { id: body.locationId },
    });

    if (!instanceType || !location) {
      res
        .status(400)
        .json({ data: "Could not find one of instanceType or location" });
      return;
    }

    const subnets = await getVpcSubnets(location);
    const subnet = subnets[Math.floor(Math.random() * subnets.length)];
    const params: RunInstancesCommandInput = {
      ImageId: "ami-0fa60543f60171fe3", // Windows Server 2019
      InstanceType: instanceType.name,
      SubnetId: subnet.SubnetId,
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
    const instance = resp.Instances?.[0];

    if (!instance || !instance.InstanceId) {
      res
        .status(500)
        .json({ data: "Something went wrong. Could not start instance" });
      return;
    }

    const software = await prisma.instance.create({
      data: {
        instanceId: instance.InstanceId,
        instanceTypeId: body.instanceTypeId,
        locationId: body.locationId,
        state: instance.State!.Name!,
      },
    });
    res.status(201).json({ data: { id: software.id } });
  } else {
    res.status(405).json({ detail: "Method not allowed." });
  }
};

export default handler;
