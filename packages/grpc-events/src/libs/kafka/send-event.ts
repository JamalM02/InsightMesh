import { InternalError, InvalidArgumentError } from '@insightmesh/node-common';
import { CreateEventRequest } from '@grpc/service';
import { kafkaProducer } from './kafka';
import { typeid } from 'typeid-js';

export const sendKafkaEvent = async (payload: CreateEventRequest) => {
  if (!payload.appId || !payload.type || !payload.data) {
    throw new InvalidArgumentError('appId, type, and data are required');
  }

  try {
    const message = {
      id: typeid('evt').toString(),
      type: payload.type,
      appId: payload.appId,
      data: payload.data,
    };

    await kafkaProducer.send({
      topic: 'events',
      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
    });
    return message;
  } catch (error) {
    throw new InternalError();
  }
};
