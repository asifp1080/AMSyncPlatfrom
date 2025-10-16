import { z } from "zod";

export const DocumentStatusSchema = z.enum(['RECEIVED', 'REVIEWED', 'NEEDS_INFO']);

export const CustomerDocumentSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  policyId: z.string().uuid().optional(),
  orgId: z.string().uuid(),
  fileName: z.string(),
  fileType: z.string(),
  size: z.number(),
  uploadedAt: z.date(),
  uploadedBy: z.enum(['customer', 'staff']),
  status: DocumentStatusSchema,
  notes: z.string().optional(),
  downloadUrl: z.string().optional(),
});

export type DocumentStatus = z.infer<typeof DocumentStatusSchema>;
export type CustomerDocument = z.infer<typeof CustomerDocumentSchema>;

export const CreateCustomerDocumentSchema = CustomerDocumentSchema.omit({
  id: true,
  uploadedAt: true,
  downloadUrl: true,
});

export type CreateCustomerDocument = z.infer<typeof CreateCustomerDocumentSchema>;