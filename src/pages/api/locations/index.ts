import type { NextApiRequest, NextApiResponse } from "next";
import { dispatcher } from "../../../actions";
import { CREATE_LOCATION } from "../../../actions/handlers/createLocation";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;
  if (req.method === "POST") {
    const location = await dispatcher.dispatch({
      type: CREATE_LOCATION,
      payload: body,
    });
    res.status(201).json({ data: location });
  } else {
    res.status(405).json({ detail: "Method not allowed." });
  }
};

export default handler;
