import { z } from "zod";

export const CreateOrganizationSchema = z.object({
  name: z
    .string({ message: "Name must be at least 3 characters long" })
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name must be at most 50 characters long"),
  slug: z
    .string()
    .refine((value) => value === "" || /^[a-z0-9-]+$/.test(value), {
      message: "Can contain only lowercase letters, digits, and '-'",
    })
    .optional(),
});

export type CreateOrganizationParams = z.infer<typeof CreateOrganizationSchema>;
