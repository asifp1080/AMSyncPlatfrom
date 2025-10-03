import { z } from "zod";
import { AddressSchema } from "./location";

export const PolicyStatusSchema = z.enum([
  "PENDING",
  "ACTIVE",
  "CANCELLED",
  "EXPIRED",
]);

export const PolicySourceSchema = z.enum(["manual", "ivans", "turborater"]);

export const PolicyStatusHistorySchema = z.object({
  at: z.date(),
  from: z.string(),
  to: z.string(),
  reason: z.string().optional(),
  by: z.string().uuid(),
});

export const PolicyUnderwritingSchema = z.object({
  status: z.string(),
  notes: z.string().optional(),
});

export const PolicySchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  entityId: z.string().uuid(),
  locationId: z.string().uuid(),
  customerRef: z.string().uuid(),
  productRef: z.string().uuid(),
  number: z.string().min(1, "Policy number is required"),
  effectiveDate: z.date(),
  expirationDate: z.date(),
  status: PolicyStatusSchema,
  statusHistory: z.array(PolicyStatusHistorySchema).default([]),
  underwriting: PolicyUnderwritingSchema.optional(),
  policySource: PolicySourceSchema.optional(),
  documents: z.array(z.string()).default([]), // Storage paths
  riskAddress: AddressSchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PolicyStatus = z.infer<typeof PolicyStatusSchema>;
export type PolicySource = z.infer<typeof PolicySourceSchema>;
export type PolicyStatusHistory = z.infer<typeof PolicyStatusHistorySchema>;
export type PolicyUnderwriting = z.infer<typeof PolicyUnderwritingSchema>;
export type Policy = z.infer<typeof PolicySchema>;

export const CreatePolicySchema = PolicySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  statusHistory: true,
});

export type CreatePolicy = z.infer<typeof CreatePolicySchema>;
