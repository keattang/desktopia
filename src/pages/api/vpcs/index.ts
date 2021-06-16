import type { NextApiRequest, NextApiResponse } from "next";
import getVpcs from "../../../aws/getVpcs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let { region } = req.query;
  if (req.method === "GET") {
    if (!region) {
      return res.status(400).json({ data: ["Region is required."] });
    }

    if (Array.isArray(region)) {
      region = region[0];
    }

    const vpcs = await getVpcs(region, {});
    res.status(200).json({ data: vpcs });
  } else {
    res.status(405).json({ detail: "Method not allowed." });
  }
};

export default handler;
