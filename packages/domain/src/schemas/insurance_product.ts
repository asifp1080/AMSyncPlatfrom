import { z } from "zod";

export const LineOfBusinessSchema = z.enum([
  "AUTO",
  "HOME",
  "RENTERS",
  "UMBRELLA",
  "COMMERCIAL",
  "LIFE",
  "HEALTH",
  "DISABILITY",
  "OTHER",
]);

export const InsuranceProductSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  companyRef: z.string().uuid(),
  groupRef: z.string().uuid(),
  name: z.string().min(1, "Product name is required"),
  lob: LineOfBusinessSchema,
  metadata: z.any().optional(),
});

export type LineOfBusiness = z.infer<typeof LineOfBusinessSchema>;
export type InsuranceProduct = z.infer<typeof InsuranceProductSchema>;

export const CreateInsuranceProductSchema = InsuranceProductSchema.omit({
  id: true,
});

export type CreateInsuranceProduct = z.infer<
  typeof CreateInsuranceProductSchema
>;
