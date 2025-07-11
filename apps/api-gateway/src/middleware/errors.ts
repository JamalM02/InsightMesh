import { NextFunction, Request, Response } from 'express';
import { ClientError } from 'nice-grpc';

export const errorsMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  if (!res.status) {
    next(err);
    return;
  }

  if (err instanceof ClientError) {
    res.status(500).json({
      message: err.details || err.message || 'Unknown gRPC error',
    });
    return;
  }

  res.status(statusCode).json({
    message: err.message || 'Unknown error',
  });
};
