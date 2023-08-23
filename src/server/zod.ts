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
  action: z.object({
    name: z.string(),
  }),
});
