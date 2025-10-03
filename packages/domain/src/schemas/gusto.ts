import { z } from "zod";

export const GustoIntegrationSchema = z.object({
  orgId: z.string(),
  connected: z.boolean(),
  companyId: z.string().optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  tokenExpiresAt: z.date().optional(),
  lastSyncAt: z.date().optional(),
  status: z.enum(['ok', 'error']).optional(),
  errorMessage: z.string().optional(),
  webhookSecret: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GustoCompanySchema = z.object({
  id: z.string(),
  name: z.string(),
  ein: z.string().optional(),
  locations: z.array(z.object({
    id: z.string(),
    street1: z.string(),
    street2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  })),
});

export const GustoEmployeeSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().optional(),
  workLocationId: z.string().optional(),
  department: z.string().optional(),
  jobTitle: z.string().optional(),
  employmentStatus: z.string(),
  hireDate: z.string().optional(),
});

export const GustoWebhookEventSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  eventType: z.string(),
  resourceType: z.string(),
  resourceId: z.string(),
  timestamp: z.date(),
  processed: z.boolean(),
  data: z.record(z.unknown()),
  createdAt: z.date(),
});

export type GustoIntegration = z.infer<typeof GustoIntegrationSchema>;
export type GustoCompany = z.infer<typeof GustoCompanySchema>;
export type GustoEmployee = z.infer<typeof GustoEmployeeSchema>;
export type GustoWebhookEvent = z.infer<typeof GustoWebhookEventSchema>;

export type CreateGustoIntegration = z.infer<typeof GustoIntegrationSchema>;
export type CreateGustoWebhookEvent = z.infer<typeof GustoWebhookEventSchema>;