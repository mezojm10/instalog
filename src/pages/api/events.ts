import { prisma } from "~/server/db";
import { eventInputSchema } from "~/server/zod";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const events = await prisma.event.findMany({
      include: {
        action: true,
      }
    });
    res.status(200).send(events);
  } else if (req.method === "POST") {
    const result = eventInputSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).send(result.error.issues);
    } else {
      await prisma.event.create({
        data: {
          actorId: result.data.actorId,
          actorName: result.data.actorName,
          group: result.data.group,
          targetId: result.data.targetId,
          targetName: result.data.targetName,
          location: result.data.location,
          metadata: result.data.metadata ?? {},
          action: {
            create: {
              name: result.data.action.name,
            }
          }
        }
      });
      res.status(200).json({
        status: "success",
      });
    }
  } else {
    res.status(405).json({
      status: "error",
      error: "Method not allowed"
    });
  }
}
