import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();
const envSchema = z.object({
  HOST: z.string(),
  PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  KAFKA_URL: z.string(),
  KAFKA_CLIENT_ID: z.string(),
});
type Env = z.infer<typeof envSchema>;
const envValues = envSchema.parse(process.env);
export const env = <T extends keyof Env>(key: T): Env[T] => envValues[key];
