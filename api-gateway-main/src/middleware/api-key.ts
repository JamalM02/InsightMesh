import { NextFunction, Request, Response } from 'express';
import { accountRpcClient } from '@events-project/grpc-account';

export const apiKeyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) throw new Error();
    const account = await accountRpcClient.validateApiKey({ key: apiKey as string });
    req.account = { id: account.id };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
