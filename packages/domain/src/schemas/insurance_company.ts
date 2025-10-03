import { z } from "zod";

export const InsuranceCompanyTypeSchema = z.enum(["Carrier", "MGA", "Broker"]);

export const InsuranceCompanySchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  name: z.string().min(1, "Company name is required"),
  companyType: InsuranceCompanyTypeSchema.optional(),
  naic: z.string().optional(),
  commissionStructure: z.any().optional(),
  agentPortalUrl: z.string().url().optional(),
  paymentUrl: z.string().url().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type InsuranceCompanyType = z.infer<typeof InsuranceCompanyTypeSchema>;
export type InsuranceCompany = z.infer<typeof InsuranceCompanySchema>;

export const CreateInsuranceCompanySchema = InsuranceCompanySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateInsuranceCompany = z.infer<
  typeof CreateInsuranceCompanySchema
>;
