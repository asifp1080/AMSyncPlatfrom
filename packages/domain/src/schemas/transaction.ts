import { z } from "zod";

export const TransactionTypeSchema = z.enum([
  "NEW",
  "RENEWAL", 
  "ENDORSEMENT",
  "CANCELLATION",
  "REINSTATEMENT"
]);

export const TransactionStatusSchema = z.enum([
  "PENDING",
  "AUTHORIZED", 
  "CAPTURED",
  "SETTLED",
  "VOIDED",
  "REFUNDED",
  "FAILED"
]);

export const PaymentMethodSchema = z.enum([
  "card",
  "ach", 
  "cash",
  "check"
]);

export const PaymentGatewaySchema = z.enum([
  "authnet",
  "offline"
]);

export const FeeSchema = z.object({
  code: z.string(),
  label: z.string(),
  amount: z.number(),
  taxable: z.boolean().optional()
});

export const PaymentSchema = z.object({
  method: PaymentMethodSchema,
  amount: z.number(),
  ref: z.string().optional(),
  gateway: PaymentGatewaySchema.optional()
});

export const AmountSchema = z.object({
  subtotal: z.number(),
  feesTotal: z.number(),
  taxTotal: z.number().optional(),
  grandTotal: z.number(),
  currency: z.string().default("USD")
});

export const GatewayMetaSchema = z.object({
  authnet: z.object({
    transactionId: z.string().optional(),
    batchId: z.string().optional(),
    avs: z.string().optional(),
    cvv: z.string().optional()
  }).optional()
}).optional();

export const ReceiptSchema = z.object({
  number: z.number(),
  pdfUrl: z.string().optional(),
  issuedAt: z.date().optional()
});

export const TransactionSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  entityId: z.string(),
  locationId: z.string(), // home location
  performedAtLocationId: z.string(), // where action occurred
  policyRef: z.string(),
  customerRef: z.string(),
  userRef: z.string(),
  type: TransactionTypeSchema,
  fees: z.array(FeeSchema),
  payments: z.array(PaymentSchema),
  amount: AmountSchema,
  status: TransactionStatusSchema,
  gatewayMeta: GatewayMetaSchema,
  receipt: ReceiptSchema,
  createdAt: z.date(),
  updatedAt: z.date()
});

export type TransactionType = z.infer<typeof TransactionTypeSchema>;
export type TransactionStatus = z.infer<typeof TransactionStatusSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type PaymentGateway = z.infer<typeof PaymentGatewaySchema>;
export type Fee = z.infer<typeof FeeSchema>;
export type Payment = z.infer<typeof PaymentSchema>;
export type Amount = z.infer<typeof AmountSchema>;
export type GatewayMeta = z.infer<typeof GatewayMetaSchema>;
export type Receipt = z.infer<typeof ReceiptSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;

export const CreateTransactionSchema = TransactionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  receipt: true
}).extend({
  receipt: z.object({
    number: z.number().optional()
  }).optional()
});

export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;

// Counter schema for receipt numbering
export const CounterSchema = z.object({
  id: z.string(),
  value: z.number(),
  updatedAt: z.date()
});

export type Counter = z.infer<typeof CounterSchema>;