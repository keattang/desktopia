import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  EC2Client,
  paginateDescribeSubnets,
  Subnet,
} from "@aws-sdk/client-ec2";
import { Location } from ".prisma/client";

const getVpcSubnets = async (location: Location): Promise<Subnet[]> => {
  const ec2Client = new EC2Client({ region: location.region });

  const paginator = paginateDescribeSubnets(
    { client: ec2Client },
    { Filters: [{ Name: "vpc-id", Values: [location.vpcId] }] }
  );

  const subnets = [];

  for await (const page of paginator) {
    // page contains a single paginated output.
    if (!page.Subnets) {
      continue;
    }

    subnets.push(...page.Subnets);
  }

  return subnets;
};

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
    const params = {
      InstanceType: instanceType?.name,
      //   SecurityGroups: [],
    };
    const software = await prisma.instance.create({
      data: {
        instanceTypeId: body.instanceTypeId,
        locationId: body.locationId,
      },
    });
    res.status(201).json({ data: { id: software.id } });
  } else {
    res.status(405).json({ detail: "Method not allowed." });
  }
};

export default handler;
