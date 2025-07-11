import { InternalError } from '@events-project/common';
import { CreateEventRequest } from '@grpc/service';
import { kafkaProducer } from './kafka';
import { typeid } from 'typeid-js';

export const sendKafkaEvent = async (payload: CreateEventRequest) => {
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
