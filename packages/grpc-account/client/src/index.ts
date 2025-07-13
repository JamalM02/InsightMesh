import dotenv from 'dotenv';
import { createChannel, createClient as createNiceGrpcClient } from 'nice-grpc';
import {
  AccountServiceClient,
  AccountServiceDefinition
} from './service';

dotenv.config();

export * from './service';

export function createClient(url?: string): AccountServiceClient {
  const serviceUrl = url || process.env.GRPC_ACCOUNT_URL;
  if (!serviceUrl) throw new Error('GRPC_ACCOUNT_URL is not set and no URL was provided');
  const channel = createChannel(serviceUrl);
  return createNiceGrpcClient(AccountServiceDefinition, channel);
}

export const accountRpcClient = createClient();
