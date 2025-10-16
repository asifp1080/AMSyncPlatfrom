import { z } from "zod";

export const SupportThreadStatusSchema = z.enum(['OPEN', 'PENDING', 'CLOSED']);

export const SupportThreadSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  customerId: z.string().uuid(),
  subject: z.string(),
  status: SupportThreadStatusSchema,
  createdAt: z.date(),
  lastUpdatedAt: z.date(),
});

export const MessageSenderSchema = z.enum(['customer', 'staff']);

export const MessageSchema = z.object({
  id: z.string().uuid(),
  threadId: z.string().uuid(),
  sender: MessageSenderSchema,
  text: z.string(),
  sentAt: z.date(),
  readByStaff: z.boolean().optional(),
});

export type SupportThreadStatus = z.infer<typeof SupportThreadStatusSchema>;
export type SupportThread = z.infer<typeof SupportThreadSchema>;
export type MessageSender = z.infer<typeof MessageSenderSchema>;
export type Message = z.infer<typeof MessageSchema>;

export const CreateSupportThreadSchema = SupportThreadSchema.omit({
  id: true,
  createdAt: true,
  lastUpdatedAt: true,
});

export const CreateMessageSchema = MessageSchema.omit({
  id: true,
  sentAt: true,
});

export type CreateSupportThread = z.infer<typeof CreateSupportThreadSchema>;
export type CreateMessage = z.infer<typeof CreateMessageSchema>;