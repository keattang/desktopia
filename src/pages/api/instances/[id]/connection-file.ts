import type { NextApiRequest, NextApiResponse } from "next";
import { dispatcher } from "../../../../actions";
import { GET_INSTANCE_CONNECTION_FILE } from "../../../../actions/handlers/getInstanceConnectionFile";
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

    const fileData = await dispatcher.dispatch({
      type: GET_INSTANCE_CONNECTION_FILE,
      payload: instance,
    });

    const fileName = encodeURIComponent(`${instance.publicDnsName}.rdp`);

    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.status(200).send(fileData);
  } else {
    res.status(405).json({ detail: "Method not allowed." });
  }
};

export default handler;
