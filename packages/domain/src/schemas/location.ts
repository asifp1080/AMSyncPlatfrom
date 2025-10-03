import { z } from "zod";

export const AddressSchema = z.object({
  street1: z.string().min(1, "Street address is required"),
  street2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

export const LocationSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  entityId: z.string().uuid(),
  name: z.string().min(1, "Location name is required"),
  code: z.string().optional(),
  type: z.enum(["headquarters", "branch", "warehouse", "retail", "office"]),
  address: AddressSchema,
  contact: z
    .object({
      phone: z.string().optional(),
      email: z.string().email().optional(),
      website: z.string().url().optional(),
    })
    .optional(),
  isActive: z.boolean().default(true),
  settings: z
    .object({
      timezone: z.string().optional(),
      operatingHours: z
        .object({
          monday: z.string().optional(),
          tuesday: z.string().optional(),
          wednesday: z.string().optional(),
          thursday: z.string().optional(),
          friday: z.string().optional(),
          saturday: z.string().optional(),
          sunday: z.string().optional(),
        })
        .optional(),
    })
    .default({}),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().uuid(),
});

export type Address = z.infer<typeof AddressSchema>;
export type Location = z.infer<typeof LocationSchema>;

export const CreateLocationSchema = LocationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateLocation = z.infer<typeof CreateLocationSchema>;
