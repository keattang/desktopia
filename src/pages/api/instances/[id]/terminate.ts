import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma";
import coalesceQueryParam from "../../../../utilities/getQueryParam";
import terminateInstances from "../../../../aws/terminateInstances";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  const id = coalesceQueryParam(query.id);

  if (req.method === "POST") {
    const instance = await prisma.instance.findUnique({
      where: { id },
      include: { location: true },
    });

    if (!instance) {
      return res.status(404).json({ data: "Not found" });
    }
    const resp = await terminateInstances(instance.location.region, {
      InstanceIds: [instance.instanceId],
    });

    res.status(200).json({ data: resp.TerminatingInstances?.[0] });
  } else {
    res.status(405).json({ detail: "Method not allowed." });
  }
};

export default handler;
