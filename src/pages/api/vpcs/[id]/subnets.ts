import type { NextApiRequest, NextApiResponse } from "next";
import getSubnets from "../../../../aws/getSubnets";
import coalesceQueryParam from "../../../../utilities/getQueryParam";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let { query } = req;

  const region = coalesceQueryParam(query.region);
  const id = coalesceQueryParam(query.id);

  if (req.method === "GET") {
    if (!region) {
      return res.status(400).json({ data: ["Region is required."] });
    }

    const subnets = await getSubnets(region, {
      Filters: [{ Name: "vpc-id", Values: [id] }],
    });

    res.status(200).json({ data: subnets });
  } else {
    res.status(405).json({ detail: "Method not allowed." });
  }
};

export default handler;
