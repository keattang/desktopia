import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;
  if (req.method === "POST") {
    const software = await prisma.location.create({
      data: {
        name: body.name,
        region: body.region,
        vpcId: body.vpcId,
      },
    });
    res.status(201).json({ data: { id: software.id } });
  } else {
    res.status(405).json({ detail: "Method not allowed." });
  }
};

export default handler;
