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
    where: {
      actorId: {
        equals: reqQuery.data.actorId,
      },
      actorName: {
        search: reqQuery.data.search,
      },
      actorEmail: reqQuery.data.search ? {
        search: reqQuery.data.search
      } : {
        equals: reqQuery.data.actorEmail,
      },
      targetId: {
        equals: reqQuery.data.targetId,
      },
      actionId: {
        equals: reqQuery.data.actionId,
      },
      action: {
        name: reqQuery.data.search ? {
          contains: reqQuery.data.search,
        } : {
          equals: reqQuery.data.actionName,
        }
      },
    }
  };

  // Search
  if (reqQuery.data.search) query.where = {
    actorId: {
      equals: reqQuery.data.actorId,
    },
    targetId: {
      equals: reqQuery.data.targetId,
    },
    actionId: {
      equals: reqQuery.data.actionId,
    },
    OR: [
      {
        actorName: {
          search: reqQuery.data.search,
        },
        actorEmail: {
          search: reqQuery.data.search,
        },
      },
      {
        action: {
          name: {
            contains: reqQuery.data.search
          }
        }
      }
    ],
  };

  // Pagination
  if (reqQuery.data.startAfter) {
    query.cursor = { id: reqQuery.data.startAfter };
    query.skip = 1;
  }

  const events = await prisma.event.findMany(query);
  res.status(200).json({
    success: true,
    events
  });
}
