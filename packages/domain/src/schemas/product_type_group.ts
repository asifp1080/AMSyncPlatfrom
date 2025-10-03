import { z } from "zod";

export const ProductTypeGroupSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  name: z.string().min(1, "Group name is required"),
  description: z.string().optional(),
});

export type ProductTypeGroup = z.infer<typeof ProductTypeGroupSchema>;

export const CreateProductTypeGroupSchema = ProductTypeGroupSchema.omit({
  id: true,
});

export type CreateProductTypeGroup = z.infer<
  typeof CreateProductTypeGroupSchema
>;
