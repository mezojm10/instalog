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
  group: z.string(),
  targetId: z.string(),
  targetName: z.string(),
  location: z.string(),
  metadata: jsonSchema.default({}),
  actionId: z.string().optional(),
  actionName: z.string().optional(),
});

export const eventQuerySchema = z.object({
  startAfter: z.string().nullable().default(null),
  actorId: z.string().nullable().default(null),
  targetId: z.string().nullable().default(null),
  actionId: z.string().nullable().default(null),
  actionName: z.string().nullable().default(null),
}).default({});
