import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma";
import coalesceQueryParam from "../../../../utilities/getQueryParam";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  const id = coalesceQueryParam(query.id);

  if (req.method === "GET") {
    const instance = await prisma.instance.findUnique({ where: { id } });

    if (!instance) {
      return res.status(404).json({ data: "Not found" });
    }

    res.status(200).json({ data: instance });
  } else {
    res.status(405).json({ detail: "Method not allowed." });
  }
};

export default handler;
