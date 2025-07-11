import z from 'zod';

export const PeriodBillingSchema = z.object({
  appId: z.string().min(1, 'App ID is required'),
  target: z
    .string()
    .datetime({ message: 'Start must be a valid ISO timestamp' })
    .transform((value) => new Date(value)),
});
export type PeriodBillingParams = z.infer<typeof PeriodBillingSchema>;
