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

    if (!instance.publicDnsName) {
      return res
        .status(409)
        .json({ data: "Connection file not yet available" });
    }

    const payload = `auto connect:i:1
full address:s:${instance.publicDnsName}
username:s:Administrator`;

    const fileName = encodeURIComponent(`${instance.publicDnsName}.rdp`);

    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.status(200).send(payload);
  } else {
    res.status(405).json({ detail: "Method not allowed." });
  }
};

export default handler;
