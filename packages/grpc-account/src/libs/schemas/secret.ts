import z from 'zod';

export const SecretSchema = z.object({
  appId: z.string().min(1, 'Account ID is required'),
});
export type SecretParams = z.infer<typeof SecretSchema>;
