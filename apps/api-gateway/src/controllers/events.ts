import { eventsRpcClient } from '@events-project/grpc-events';
import { Request, Response } from 'express';

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  const result = await eventsRpcClient.createEvent({
    appId: req.account?.id,
    data: req.body?.data,
    type: req.body?.type,
  });
  res.status(201).json(result);
};
