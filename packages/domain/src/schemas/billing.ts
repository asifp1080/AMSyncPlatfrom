import { z } from "zod";

export const OrgBillingSchema = z.object({
  orgId: z.string(),
  stripeCustomerId: z.string(),
  subscription: z.object({
    id: z.string(),
    status: z.enum(['active', 'trialing', 'past_due', 'canceled', 'incomplete']),
    priceId: z.string(),
    currentPeriodEnd: z.date().optional(),
  }).optional(),
  history: z.array(z.object({
    invoiceId: z.string(),
    amount: z.number(),
    paidAt: z.date().optional(),
    status: z.string(),
  })).optional(),
  updatedAt: z.date(),
});

export const BillingPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  priceId: z.string(),
  price: z.number(),
  currency: z.string(),
  interval: z.enum(['month', 'year']),
  features: z.array(z.string()),
  isActive: z.boolean(),
});

export type OrgBilling = z.infer<typeof OrgBillingSchema>;
export type BillingPlan = z.infer<typeof BillingPlanSchema>;

export type CreateOrgBilling = z.infer<typeof OrgBillingSchema>;
export type CreateBillingPlan = z.infer<typeof BillingPlanSchema>;