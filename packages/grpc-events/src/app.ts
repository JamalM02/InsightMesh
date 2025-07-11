import { createServer, Server } from 'nice-grpc';

import { EventsServiceDefinition } from '@grpc/service';
import * as methods from './methods';
import { env } from '@libs/env';
import { kafkaProducer } from '@libs/kafka';
import { errorHandlingMiddleware, logger } from '@events-project/common';

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
    server.add(EventsServiceDefinition, methods);

    // Connect to database
    await kafkaProducer.connect();
    await server.listen(address);

    const signals = ['SIGINT', 'SIGTERM'];

    signals.forEach((signal) => {
      process.once(signal, () => gracefulShutdown(server));
    });
  } catch (error) {
    console.error(' Failed to start server:', error);
    logger.error('Failed to start server:', error as Error);
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
