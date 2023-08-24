import NextCors from "nextjs-cors";

import { createEvent } from "~/server/createEvent";
import { queryEvents } from "~/server/listEvents";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'POST'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

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


