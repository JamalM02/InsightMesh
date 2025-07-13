import dotenv from 'dotenv';
import { createChannel, createClient as createNiceGrpcClient } from 'nice-grpc';
import {
  EventsServiceClient,
  EventsServiceDefinition
} from './service';

dotenv.config();

export * from './service';

export function createClient(url?: string): EventsServiceClient {
  const serviceUrl = url || process.env.GRPC_EVENTS_URL;
  if (!serviceUrl) throw new Error('GRPC_EVENTS_URL is not set and no URL was provided');
  const channel = createChannel(serviceUrl);
  return createNiceGrpcClient(EventsServiceDefinition, channel);
}

export const eventsRpcClient = createClient();
