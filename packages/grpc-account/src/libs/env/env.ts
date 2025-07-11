import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();
const envSchema = z.object({
  HOST: z.string(),
  PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  SECRET_ENCRYPT_KEY: z.string(),
  KAFKA_URL: z.string(),
  KAFKA_CLIENT_ID: z.string(),
  KAFKA_TOPIC: z.string(),
  KAFKA_GROUP_ID: z.string(),
  SERVICE_NAME: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  CLICKHOUSE_URL: z.string(),
  CLICKHOUSE_USERNAME: z.string(),
  CLICKHOUSE_PASSWORD: z.string(),
});
type Env = z.infer<typeof envSchema>;
const envValues = envSchema.parse(process.env);
export const env = <T extends keyof Env>(key: T): Env[T] => envValues[key];
