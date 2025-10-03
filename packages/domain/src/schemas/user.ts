import { z } from 'zod';

export const UserRoleSchema = z.enum([
  'owner',
  'admin', 
  'manager',
  'agent'
]);

export const UserSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  entityId: z.string().optional(),
  role: UserRoleSchema,
  directLocationIds: z.array(z.string()).default([]),
  groupIds: z.array(z.string()).default([]),
  managerUserId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserRole = z.infer<typeof UserRoleSchema>;
export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateUser = z.infer<typeof CreateUserSchema>;