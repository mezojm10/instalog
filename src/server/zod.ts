import { z } from "zod";

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

export const eventInputSchema = z.object({
  actorId: z.string(),
  actorName: z.string(),
  actorEmail: z.string().email(),
  group: z.string(),
  targetId: z.string(),
  targetName: z.string(),
  location: z.string(),
  metadata: jsonSchema.default({}),
  actionId: z.string().optional(),
  actionName: z.string().optional(),
});

export const eventQuerySchema = z.object({
  startAfter: z.string().optional(),
  actorId: z.string().optional(),
  actorEmail: z.string().email().optional(),
  targetId: z.string().optional(),
  actionId: z.string().optional(),
  actionName: z.string().optional(),
  search: z.string().optional(),
}).default({});

export const eventSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  actorId: z.string(),
  actorName: z.string(),
  actorEmail: z.string().email(),
  group: z.string(),
  targetId: z.string(),
  targetName: z.string(),
  location: z.string(),
  metadata: jsonSchema.default({}),
  action: z.object({
    id: z.string(),
    name: z.string(),
  })
});

export const eventFetchSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
  events: z.array(eventSchema).optional(),
});

export type Event = z.infer<typeof eventSchema>;
