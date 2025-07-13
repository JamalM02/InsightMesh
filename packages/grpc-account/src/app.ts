import { createServer, Server } from 'nice-grpc';
import { startKafkaConsumer } from '@libs/kafka';

import { AccountServiceDefinition } from '@grpc/service';
import { db } from '@libs/database';
import * as methods from './methods';
import { env } from '@libs/env';
import { errorHandlingMiddleware, logger } from '@insightmesh/node-common';

const address = `${env('HOST')}:${env('PORT')}`;

process.on('unhandledRejection', (reason) => {
  logger.error(reason, `Unhandled Rejection: ${reason}`);
});

process.on('uncaughtException', (error) => {
  logger.error(error, `Uncaught Exception: ${error}`);
});

async function gracefulShutdown(server: Server): Promise<void> {
  try {
    await server.shutdown();
    process.exit(0);
  } catch (error) {
    logger.error(error, `Error during server shutdown: ${error}`);
    process.exit(1);
  }
}

async function startServer(): Promise<void> {
  try {
    const server = createServer().use(errorHandlingMiddleware);
    server.add(AccountServiceDefinition, methods);
    await db.$connect();
    await startKafkaConsumer();
    logger.debug('Kafka consumer started');
    await server.listen(address);

    const signals = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
      process.once(signal, () => gracefulShutdown(server));
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer()
  .then(() => {
    logger.debug(`Server started on ${address}`);
  })
  .catch((error) => {
    logger.error('Unhandled error:', error as Error);
    process.exit(1);
  });
