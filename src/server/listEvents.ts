import { eventQuerySchema } from "~/server/zod";
import { prisma } from "~/server/db";

import type { NextApiRequest, NextApiResponse } from "next";
import type { Prisma } from "@prisma/client";

export async function queryEvents(req: NextApiRequest, res: NextApiResponse) {
  const reqQuery = eventQuerySchema.safeParse(req.query);
  if (!reqQuery.success) {
    res.status(400).json({
      success: false,
      error: "invalid query parameters"
    });
    return;
  }
  const query: Prisma.EventFindManyArgs = {
    include: {
      action: true,
    },
    take: 10,
    orderBy: {
      createdAt: "desc"
    },
  };

  // Pagination
  if (reqQuery.data.startAfter) query.cursor = { id: reqQuery.data.startAfter };

  // actorId filter
  if (reqQuery.data.actorId) query.where = { ...query.where, actorId: { equals: reqQuery.data.actorId } };
  // targetId filter
  if (reqQuery.data.targetId) query.where = { ...query.where, targetId: { equals: reqQuery.data.targetId } };
  // actionId filter
  if (reqQuery.data.actionId) query.where = { ...query.where, actionId: { equals: reqQuery.data.actionId } };
  // actionName filter
  if (reqQuery.data.actionName) query.where = { ...query.where, action: { name: { equals: reqQuery.data.actionName } } };

  const events = await prisma.event.findMany(query);
  res.status(200).json({
    success: true,
    events
  });
}
