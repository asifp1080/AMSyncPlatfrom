import { z } from "zod";

export const CommunicationSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  type: z.enum(['email', 'sms']),
  template: z.string(),
  to: z.string(),
  subject: z.string().optional(),
  variables: z.record(z.unknown()).optional(),
  related: z.object({
    txnId: z.string().optional(),
    policyId: z.string().optional(),
    customerId: z.string().optional(),
  }).optional(),
  status: z.enum(['QUEUED', 'SENT', 'FAILED']),
  providerId: z.string().optional(),
  error: z.string().optional(),
  createdAt: z.date(),
  sentAt: z.date().optional(),
});

export const NotificationPreferencesSchema = z.object({
  emailEnabled: z.boolean(),
  smsEnabled: z.boolean(),
  defaultFromName: z.string().optional(),
  defaultFromEmail: z.string().optional(),
});

export const NotificationTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['email', 'sms']),
  subject: z.string().optional(),
  content: z.string(),
  variables: z.array(z.string()),
  isActive: z.boolean(),
});

export type Communication = z.infer<typeof CommunicationSchema>;
export type NotificationPreferences = z.infer<typeof NotificationPreferencesSchema>;
export type NotificationTemplate = z.infer<typeof NotificationTemplateSchema>;

export type CreateCommunication = z.infer<typeof CommunicationSchema>;
export type CreateNotificationTemplate = z.infer<typeof NotificationTemplateSchema>;