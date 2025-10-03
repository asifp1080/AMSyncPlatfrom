import { z } from 'zod';

export const PreferencesSchema = z.object({
  brand: z.object({
    name: z.string(),
    logoUrl: z.string().url().optional(),
  }),
  currency: z.string().default('USD'),
  decimals: z.number().default(2),
  dateFormat: z.string().default('MM/DD/YYYY'),
  timeFormat: z.string().default('12h'),
  timezone: z.string().default('UTC'),
});

export type Preferences = z.infer<typeof PreferencesSchema>;

export const CreatePreferencesSchema = PreferencesSchema.partial();

export type CreatePreferences = z.infer<typeof CreatePreferencesSchema>;