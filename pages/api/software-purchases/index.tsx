import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;
  if (req.method === "POST") {
    const purchase = await prisma.softwarePurchase.create({
      data: {
        softwareId: body.softwareId,
        type: body.type,
        term: body.term,
        price: body.price,
      },
    });
    res.status(201).json({ data: { id: purchase.id } });
  } else {
    res.status(405).json({ detail: "Method not allowed." });
  }
};

export default handler;
