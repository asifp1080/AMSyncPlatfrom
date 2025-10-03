import { z } from "zod";

export const DailyReportSchema = z.object({
  id: z.string(), // orgId_YYYYMMDD
  orgId: z.string(),
  date: z.string(), // YYYY-MM-DD
  totals: z.object({
    count: z.number(),
    amount: z.number(),
    fees: z.number(),
    taxes: z.number(),
  }),
  byMethod: z.object({
    card: z.number(),
    ach: z.number(),
    cash: z.number(),
    check: z.number(),
  }),
  byType: z.object({
    NEW: z.number(),
    RENEWAL: z.number(),
    ENDORSEMENT: z.number(),
    CANCELLATION: z.number(),
    REINSTATEMENT: z.number(),
  }),
  batchIds: z.array(z.string()).optional(),
  createdAt: z.date(),
});

export const MonthlyReportSchema = z.object({
  id: z.string(), // orgId_YYYYMM
  orgId: z.string(),
  month: z.string(), // YYYY-MM
  totals: z.object({
    count: z.number(),
    amount: z.number(),
    fees: z.number(),
    taxes: z.number(),
  }),
  byMethod: z.object({
    card: z.number(),
    ach: z.number(),
    cash: z.number(),
    check: z.number(),
  }),
  byType: z.object({
    NEW: z.number(),
    RENEWAL: z.number(),
    ENDORSEMENT: z.number(),
    CANCELLATION: z.number(),
    REINSTATEMENT: z.number(),
  }),
  dailyBreakdown: z.array(z.object({
    date: z.string(),
    count: z.number(),
    amount: z.number(),
  })),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ExportRequestSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  type: z.enum(['transactions', 'policies', 'customers']),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }),
  filters: z.record(z.unknown()).optional(),
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']),
  downloadUrl: z.string().optional(),
  error: z.string().optional(),
  requestedBy: z.string(),
  createdAt: z.date(),
  completedAt: z.date().optional(),
});

export type DailyReport = z.infer<typeof DailyReportSchema>;
export type MonthlyReport = z.infer<typeof MonthlyReportSchema>;
export type ExportRequest = z.infer<typeof ExportRequestSchema>;

export type CreateDailyReport = z.infer<typeof DailyReportSchema>;
export type CreateMonthlyReport = z.infer<typeof MonthlyReportSchema>;
export type CreateExportRequest = z.infer<typeof ExportRequestSchema>;