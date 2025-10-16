import { z } from "zod";

export const NotificationTypeSchema = z.enum([
  'policy_update',
  'payment', 
  'document',
  'chat',
  'system'
]);

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  customerId: z.string().uuid(),
  type: NotificationTypeSchema,
  title: z.string(),
  body: z.string(),
  relatedId: z.string().optional(),
  read: z.boolean().default(false),
  createdAt: z.date(),
});

export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export type Notification = z.infer<typeof NotificationSchema>;

export const CreateNotificationSchema = NotificationSchema.omit({
  id: true,
  createdAt: true,
});

export type CreateNotification = z.infer<typeof CreateNotificationSchema>;