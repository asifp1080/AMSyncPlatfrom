import { z } from "zod";

export const EntitySchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  name: z.string().min(1, "Entity name is required"),
  type: z.enum(["subsidiary", "division", "department", "branch"]),
  code: z.string().optional(),
  description: z.string().optional(),
  parentEntityId: z.string().uuid().optional(),
  isActive: z.boolean().default(true),
  settings: z
    .object({
      allowTransactions: z.boolean().default(true),
      requireApproval: z.boolean().default(false),
    })
    .default({}),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().uuid(),
});

export type Entity = z.infer<typeof EntitySchema>;

export const CreateEntitySchema = EntitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateEntity = z.infer<typeof CreateEntitySchema>;
