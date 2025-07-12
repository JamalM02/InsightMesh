import express from 'express';
import routes from '@routes/index';
import { env } from '@libs/env';
import { logger } from '@insightmesh/node-common';
import { errorsMiddleware, loggerMiddleware } from '@middleware';
import cors from 'cors';

const port = env('PORT');

process.on('unhandledRejection', (reason) => {
  logger.error(reason, `Unhandled Rejection: ${reason}`);
});

process.on('uncaughtException', (error) => {
  logger.error(error, `Uncaught Exception: ${error}`);
});

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Middleware
app.use(loggerMiddleware);

// API Routes
app.use('/api', routes);

// Error handler
app.use(errorsMiddleware);

// Start server
app.listen(port, () => {
  logger.info(`API Gateway listening on port ${port}`);
});
