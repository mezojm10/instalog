import { createEvent } from "~/server/createEvent";
import { queryEvents } from "~/server/listEvents";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    await queryEvents(req, res);
    return;
  } else if (req.method === "POST") {
    await createEvent(req, res);
    return;
  }
  res.status(405).json({
    status: "error",
    error: "Method not allowed"
  });
}


