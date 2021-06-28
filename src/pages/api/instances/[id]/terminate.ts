import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma";
import coalesceQueryParam from "../../../../utilities/getQueryParam";
import { dispatcher } from "../../../../actions";
import { TERMINATE_INSTANCE } from "../../../../actions/handlers/terminateInstance";

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

    const resp = await dispatcher.dispatch({
      type: TERMINATE_INSTANCE,
      payload: instance,
    });

    res.status(200).json({ data: resp.TerminatingInstances?.[0] });
  } else {
    res.status(405).json({ detail: "Method not allowed." });
  }
};

export default handler;
