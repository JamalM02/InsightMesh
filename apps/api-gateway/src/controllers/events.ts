import { eventsRpcClient } from '@insightmesh/grpc-events';
import { Request, Response } from 'express';

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  const { type, data } = req.body ?? {};

  if (!type || typeof type !== 'string') {
    res.status(400).json({ error: 'Missing or invalid "type" field' });
    return;
  }

  if (!data || typeof data !== 'object') {
    res.status(400).json({ error: 'Missing or invalid "data" field' });
    return;
  }

  const result = await eventsRpcClient.createEvent({
    appId: req.account?.id,
    data,
    type,
  });
  res.status(201).json(result);
};
