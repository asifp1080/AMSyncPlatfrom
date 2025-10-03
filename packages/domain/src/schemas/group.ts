import { z } from 'zod';

export const LocationGroupSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  name: z.string().min(1, 'Group name is required'),
  locationIds: z.array(z.string()).default([]),
  memberUserIds: z.array(z.string()).default([]),
  managerUserId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type LocationGroup = z.infer<typeof LocationGroupSchema>;

export const CreateLocationGroupSchema = LocationGroupSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateLocationGroup = z.infer<typeof CreateLocationGroupSchema>;