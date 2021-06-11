import { EC2Client, paginateDescribeVpcs, Vpc } from "@aws-sdk/client-ec2";
import type { NextApiRequest, NextApiResponse } from "next";

const getVpcs = async (region: string): Promise<Vpc[]> => {
  const ec2Client = new EC2Client({ region });

  const paginator = paginateDescribeVpcs({ client: ec2Client }, {});

  const vpcs = [];

  for await (const page of paginator) {
    // page contains a single paginated output.
    if (!page.Vpcs) {
      continue;
    }

    vpcs.push(...page.Vpcs);
  }

  return vpcs;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let { region } = req.query;
  if (req.method === "GET") {
    if (!region) {
      return res.status(400).json({ data: ["Region is required."] });
    }

    if (Array.isArray(region)) {
      region = region[0];
    }

    const vpcs = await getVpcs(region);
    res.status(200).json({ data: vpcs });
  } else {
    res.status(405).json({ detail: "Method not allowed." });
  }
};

export default handler;
