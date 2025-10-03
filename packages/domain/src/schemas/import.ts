import { z } from "zod";

export const ImportJobSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  type: z.enum(['turborater']),
  status: z.enum(['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED']),
  files: z.array(z.object({
    name: z.string(),
    size: z.number(),
    controlId: z.string().optional(),
    storagePath: z.string(),
  })),
  counts: z.object({
    customers: z.number(),
    drivers: z.number(),
    vehicles: z.number(),
    quotes: z.number(),
  }).optional(),
  errors: z.array(z.object({
    file: z.string(),
    line: z.number().optional(),
    code: z.string(),
    message: z.string(),
  })).optional(),
  startedAt: z.date(),
  finishedAt: z.date().optional(),
  createdBy: z.string(),
});

export const QuoteSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  customerRef: z.string(),
  drivers: z.array(z.object({
    id: z.string(),
    name: z.string(),
    dateOfBirth: z.string().optional(),
    licenseNumber: z.string().optional(),
    licenseState: z.string().optional(),
    incidents: z.array(z.object({
      type: z.string(),
      date: z.string(),
      description: z.string().optional(),
    })).optional(),
  })),
  vehicles: z.array(z.object({
    id: z.string(),
    vin: z.string().optional(),
    year: z.number().optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    garagingZip: z.string().optional(),
  })),
  coverages: z.array(z.object({
    type: z.string(),
    limit: z.string().optional(),
    deductible: z.string().optional(),
  })),
  premiumBreakdown: z.object({
    basePremium: z.number(),
    taxes: z.number(),
    fees: z.number(),
    totalPremium: z.number(),
  }),
  marketResults: z.array(z.object({
    carrier: z.string(),
    premium: z.number(),
    rank: z.number(),
  })).optional(),
  source: z.literal('turborater'),
  importedAt: z.date(),
  quoteFingerprint: z.string(),
  effectiveDate: z.date().optional(),
  expirationDate: z.date().optional(),
  namedInsured: z.object({
    name: z.string(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
  }),
});

export const TurboRaterFileSchema = z.object({
  controlNumber: z.string().optional(),
  namedInsured: z.string(),
  effectiveDate: z.string().optional(),
  drivers: z.array(z.object({
    name: z.string(),
    dateOfBirth: z.string().optional(),
    licenseNumber: z.string().optional(),
    licenseState: z.string().optional(),
  })),
  vehicles: z.array(z.object({
    vin: z.string().optional(),
    year: z.string().optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    garagingZip: z.string().optional(),
  })),
  coverages: z.record(z.string()),
  premiums: z.record(z.number()),
  carriers: z.array(z.object({
    name: z.string(),
    premium: z.number(),
    rank: z.number(),
  })).optional(),
});

export type ImportJob = z.infer<typeof ImportJobSchema>;
export type Quote = z.infer<typeof QuoteSchema>;
export type TurboRaterFile = z.infer<typeof TurboRaterFileSchema>;

export type CreateImportJob = z.infer<typeof ImportJobSchema>;
export type CreateQuote = z.infer<typeof QuoteSchema>;