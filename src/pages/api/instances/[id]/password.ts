import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma";
import coalesceQueryParam from "../../../../utilities/getQueryParam";
import { dispatcher } from "../../../../actions";
import { GET_INSTANCE_PASSWORD } from "../../../../actions/handlers/getInstancePassword";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  const id = coalesceQueryParam(query.id);

  if (req.method === "GET") {
    const instance = await prisma.instance.findUnique({ where: { id } });

    if (!instance) {
      return res.status(404).json({ data: "Not found" });
    }

    if (!instance.password) {
      return res.status(409).json({ data: "Password not yet available" });
    }

    const password = await dispatcher.dispatch({
      type: GET_INSTANCE_PASSWORD,
      payload: instance,
    });

    res.status(200).json({ data: { password } });
  } else {
    res.status(405).json({ detail: "Method not allowed." });
  }
};

export default handler;
