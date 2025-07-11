import { logger } from '@events-project/common';
import { Request, Response, NextFunction } from 'express';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const start = new Date();
  res.on('finish', () => {
    const duration = new Date().getTime() - start.getTime();
    const level =
      res.statusCode >= 400 ? 'error' : res.statusCode >= 200 && duration > 300 ? 'warn' : 'info';
    logger[level](
      `[${start.toISOString()}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms`
    );
  });
  next();
};
