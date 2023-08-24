import { eventInputSchema } from "~/server/zod";
import { prisma } from "~/server/db";

import type { NextApiRequest, NextApiResponse } from "next";

export async function createEvent(req: NextApiRequest, res: NextApiResponse) {
  const result = eventInputSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      success: false,
      error: result.error.issues
    });
    return;
  }
  if (result.data.actionId) {
    await prisma.event.create({
      data: {
        actorId: result.data.actorId,
        actorName: result.data.actorName,
        group: result.data.group,
        targetId: result.data.targetId,
        targetName: result.data.targetName,
        location: result.data.location,
        metadata: result.data.metadata ?? {},
        actionId: result.data.actionId,
      }
    });
  } else {
    if (!result.data.actionName) {
      res.status(400).json({
        success: false,
        error: "Please provide an actionId or actionName"
      });
      return;
    }
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
            name: result.data.actionName,
          }
        }
      }
    });
  }
  res.status(200).json({
    status: "success",
  });
  return;
}
