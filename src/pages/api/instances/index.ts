import prisma from "../../../prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { dispatcher } from "../../../actions";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;
  if (req.method === "POST") {
    const instanceType = await prisma.instanceType.findUnique({
      where: { id: body.instanceTypeId },
    });
    const location = await prisma.location.findUnique({
      where: { id: body.locationId },
    });

    if (!instanceType || !location) {
      res
        .status(400)
        .json({ data: "Could not find one of instanceType or location" });
      return;
    }

    let awsInstance, dbInstance;

    try {
      ({ awsInstance, dbInstance } = await dispatcher.dispatch({
        type: "CREATE_INSTANCE",
        payload: { instanceType, location },
      }));
    } catch {
      res
        .status(500)
        .json({ data: "Something went wrong. Could not start instance" });
      return;
    }

    res.status(201).json({ data: dbInstance });
  } else {
    res.status(405).json({ detail: "Method not allowed." });
  }
};

export default handler;
