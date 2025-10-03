import { z } from "zod";

export const OrganizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Organization name is required"),
  slug: z.string().min(1, "Organization slug is required"),
  description: z.string().optional(),
  settings: z
    .object({
      timezone: z.string().default("UTC"),
      currency: z.string().default("USD"),
      dateFormat: z.string().default("MM/DD/YYYY"),
      fiscalYearStart: z.number().min(1).max(12).default(1),
    })
    .default({}),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().uuid(),
});

export type Organization = z.infer<typeof OrganizationSchema>;

export const CreateOrganizationSchema = OrganizationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateOrganization = z.infer<typeof CreateOrganizationSchema>;
