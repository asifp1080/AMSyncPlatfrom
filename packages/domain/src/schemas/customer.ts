import { z } from "zod";
import { AddressSchema } from "./location";

export const CustomerTypeSchema = z.enum(["individual", "business"]);

export const CustomerSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  type: CustomerTypeSchema,
  // Individual customer fields
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dateOfBirth: z.date().optional(),
  // Business customer fields
  businessName: z.string().optional(),
  taxId: z.string().optional(),
  // Common fields
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: AddressSchema.optional(),
  // Metadata
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().uuid(),
});

export type CustomerType = z.infer<typeof CustomerTypeSchema>;
export type Customer = z.infer<typeof CustomerSchema>;

export const CreateCustomerSchema = CustomerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateCustomer = z.infer<typeof CreateCustomerSchema>;
