import z from 'zod';

export const CreateAccountSchema = z.object({
  id: z.string().min(1, 'App ID is required'),
  name: z.string().min(1, 'App name is required'),
  slug: z.string().optional(),
});
export type CreateAccountParams = z.infer<typeof CreateAccountSchema>;
